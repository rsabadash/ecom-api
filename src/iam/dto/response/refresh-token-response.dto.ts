import { ApiProperty } from '@nestjs/swagger';
import { RefreshTokenResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class RefreshTokenResponseDto implements RefreshTokenResponse {
  @ApiProperty(DESCRIPTION.ACCESS_TOKEN)
  readonly accessToken: string;

  @ApiProperty(DESCRIPTION.REFRESH_TOKEN)
  readonly refreshToken: string;
}
