import { PickType } from '@nestjs/swagger';
import { TokensDto } from './tokens-dto';

export class RefreshTokenDto extends PickType(TokensDto, [
  'refreshToken',
] as const) {}
