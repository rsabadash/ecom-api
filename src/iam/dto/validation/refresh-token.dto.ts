import { IsString } from 'class-validator';
import { RefreshToken } from '../../interfaces/authentication.interface';

export class RefreshTokenDto implements RefreshToken {
  @IsString()
  readonly refreshToken: string;
}
