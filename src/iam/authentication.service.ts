import {
  Body,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from './hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import jwtConfig from './config/jwt.config';
import { Tokens, JwtDecoded } from './interfaces/jwt.interfaces';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from '../users/users.service';
import { IUserCreate, IUserPublic } from '../users/interfaces/users.interfaces';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly usersService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<IUserPublic> {
    const hashedPassword = await this.hashingService.hash(signUpDto.password);

    const user: IUserCreate = {
      ...signUpDto,
      password: hashedPassword,
    };

    return await this.usersService.createUser(user);
  }

  async signIn(signInDto: SignInDto): Promise<Tokens> {
    const user = await this.usersService.getUserByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password do not match');
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Email or password do not match');
    }

    return await this.generateTokens(user);
  }

  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<Tokens> {
    const { secret, audience, issuer } = this.jwtConfiguration;
    const { sub } = await this.jwtService.verifyAsync<Pick<JwtDecoded, 'sub'>>(
      refreshTokenDto.refreshToken,
      {
        secret,
        audience,
        issuer,
      },
    );

    const user = await this.usersService.getUser({ userId: new ObjectId(sub) });

    if (!user) {
      throw new UnauthorizedException('The user does not exist');
    }

    return await this.generateTokens(user);
  }

  async generateTokens(user: IUserPublic): Promise<Tokens> {
    try {
      const { accessTokenTtl, refreshTokenTtl } = this.jwtConfiguration;

      const aToken = this.signToken(String(user._id), accessTokenTtl);
      const rToken = this.signToken(String(user._id), refreshTokenTtl);

      const [accessToken, refreshToken] = await Promise.all([aToken, rToken]);

      return {
        accessToken,
        refreshToken,
      };
    } catch {
      if (!user) {
        throw new UnauthorizedException('The user does not exist');
      }
    }
  }

  private async signToken<T extends Record<string, any>>(
    userId: string,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    const { audience, issuer, secret } = this.jwtConfiguration;
    const signPayload = {
      sub: userId,
      ...(payload || {}),
    };

    return await this.jwtService.signAsync(signPayload, {
      audience,
      issuer,
      secret,
      expiresIn,
    });
  }
}
