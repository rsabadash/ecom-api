import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({
    description: 'The access token',
  })
  readonly accessToken: string;

  @ApiProperty({
    description: 'The refresh token to sign a new access token',
  })
  readonly refreshToken: string;
}
