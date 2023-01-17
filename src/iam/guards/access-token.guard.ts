import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { JwtDecoded } from '../interfaces/jwt.interfaces';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  private _decodedToken: JwtDecoded | null;
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    this._decodedToken = null;
  }

  get decodedToken() {
    return this._decodedToken;
  }

  set decodedToken(data) {
    this._decodedToken = data;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      this.decodedToken = await this.jwtService.verifyAsync<JwtDecoded>(
        token,
        this.jwtConfiguration,
      );
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization?.split(' ') ?? [];

    return authorizationHeader[1];
  }
}
