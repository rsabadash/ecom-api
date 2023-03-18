import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokensDto {
  @IsString()
  @ApiProperty({
    description: 'The access token',
  })
  readonly accessToken: string;

  @IsString()
  @ApiProperty({
    description: 'The refresh token to sign a new access token',
  })
  readonly refreshToken: string;
}
