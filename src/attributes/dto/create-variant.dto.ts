import { OmitType } from '@nestjs/swagger';
import { VariantDto } from './variant.dto';

export class CreateVariantDto extends OmitType(VariantDto, [
  'variantId',
] as const) {}
