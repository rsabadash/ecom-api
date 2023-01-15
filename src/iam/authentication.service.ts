import {
  Body,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { USERS_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { IUser } from './interfaces/user.interfaces';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from './hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import jwtConfig from './config/jwt.config';
import { ActiveUserData } from './interfaces/active-user-data.interfaces';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Role } from './enums/role.enum';
import { Tokens } from './interfaces/authentication.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectCollectionModel(USERS_COLLECTION)
    private readonly usersCollection: ICollectionModel<IUser>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    // TODO Check if user with the email exists
    const hashedPassword = await this.hashingService.hash(signUpDto.password);

    const user: Omit<IUser, '_id'> = {
      ...signUpDto,
      password: hashedPassword,
      role: Role.ContentManager,
    };

    return await this.usersCollection.create(user);
  }

  async signIn(signInDto: SignInDto): Promise<Tokens> {
    const user = await this.usersCollection.findOne({
      email: signInDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    return await this.generateTokens(user);
  }

  async generateTokens(user: IUser): Promise<Tokens> {
    try {
      const { accessTokenTtl, refreshTokenTtl } = this.jwtConfiguration;

      const aToken = this.signToken<Partial<ActiveUserData>>(
        String(user._id),
        accessTokenTtl,
        { email: user.email, role: user.role },
      );

      const rToken = this.signToken<Partial<ActiveUserData>>(
        String(user._id),
        refreshTokenTtl,
      );

      const [accessToken, refreshToken] = await Promise.all([aToken, rToken]);

      return {
        accessToken,
        refreshToken,
      };
    } catch {
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }
    }
  }

  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<Tokens> {
    const { secret, audience, issuer } = this.jwtConfiguration;
    const { sub } = await this.jwtService.verifyAsync<
      Pick<ActiveUserData, 'sub'>
    >(refreshTokenDto.refreshToken, {
      secret,
      audience,
      issuer,
    });

    const user = await this.usersCollection.findOne({ _id: new ObjectId(sub) });

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    return await this.generateTokens(user);
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
