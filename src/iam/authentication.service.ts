import {
  Body,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from './hashing.service';
import jwtConfig from './config/jwt.config';
import { UsersService } from '../users/users.service';
import { IUserPublic } from '../users/interfaces/users.interfaces';
import {
  RefreshToken,
  SignIn,
  SignUp,
  Tokens,
  JwtDecoded,
} from './interfaces/authentication.interface';
import {
  RefreshTokenResponse,
  SignInResponse,
  SignUpResponse,
} from './interfaces/response.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly usersService: UsersService,
  ) {}
  private async generateTokens(user: IUserPublic): Promise<Tokens> {
    const { accessTokenTtl, refreshTokenTtl } = this.jwtConfiguration;

    const aToken = this.signToken(String(user._id), accessTokenTtl);
    const rToken = this.signToken(String(user._id), refreshTokenTtl);

    const [accessToken, refreshToken] = await Promise.all([aToken, rToken]);

    return {
      accessToken,
      refreshToken,
    };
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

    return this.jwtService.signAsync(signPayload, {
      audience,
      issuer,
      secret,
      expiresIn,
    });
  }

  async signUp(signUp: SignUp): Promise<SignUpResponse> {
    const hashedPassword = await this.hashingService.hash(signUp.password);

    const user: SignUp = {
      ...signUp,
      password: hashedPassword,
    };

    const createdUser = await this.usersService.createUser(user);

    return {
      ...createdUser,
      _id: createdUser._id.toString(),
    };
  }

  async signIn(signInDto: SignIn): Promise<SignInResponse> {
    const user = await this.usersService.getUserByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('User has not been found');
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Email or password do not match');
    }

    return this.generateTokens(user);
  }

  async refreshToken(
    @Body() refreshToken: RefreshToken,
  ): Promise<RefreshTokenResponse> {
    const { secret, audience, issuer } = this.jwtConfiguration;
    let userId: null | string = null;

    try {
      const decoded = await this.jwtService.verifyAsync<
        Pick<JwtDecoded, 'sub'>
      >(refreshToken.refreshToken, {
        secret,
        audience,
        issuer,
      });

      userId = decoded.sub;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    const user = await this.usersService.getUser({
      userId,
    });

    return this.generateTokens(user);
  }
}
