import { IsNotEmpty, IsString } from 'class-validator';
import { RefreshToken } from '../../interfaces/authentication.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class RefreshTokenDto implements RefreshToken {
  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.REFRESH_TOKEN)
  readonly refreshToken: string;
}
