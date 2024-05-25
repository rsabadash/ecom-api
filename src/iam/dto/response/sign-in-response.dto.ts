import { ApiProperty } from '@nestjs/swagger';
import { SignInResponse } from '../../interfaces/response.interface';

export class SignInResponseDto implements SignInResponse {
  @ApiProperty({ description: 'Access token' })
  readonly accessToken: string;

  @ApiProperty({
    description: 'Refresh token to sign a new access token',
  })
  readonly refreshToken: string;
}
