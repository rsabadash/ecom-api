import { ApiProperty } from '@nestjs/swagger';
import { RefreshTokenResponse } from '../../interfaces/response.interface';

export class RefreshTokenResponseDto implements RefreshTokenResponse {
  @ApiProperty({ description: 'Access token' })
  readonly accessToken: string;

  @ApiProperty({
    description: 'Refresh token to sign a new access token',
  })
  readonly refreshToken: string;
}
