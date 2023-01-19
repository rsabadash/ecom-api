import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The refresh token to sign a new access token',
  })
  readonly refreshToken: string;
}
