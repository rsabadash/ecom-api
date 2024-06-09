import { ApiProperty } from '@nestjs/swagger';
import { SignInResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class SignInResponseDto implements SignInResponse {
  @ApiProperty(DESCRIPTION.ACCESS_TOKEN)
  readonly accessToken: string;

  @ApiProperty(DESCRIPTION.REFRESH_TOKEN)
  readonly refreshToken: string;
}
