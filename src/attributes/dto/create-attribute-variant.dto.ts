import { OmitType } from '@nestjs/swagger';
import { AttributeVariantDto } from './attribute-variant.dto';

export class CreateAttributeVariantDto extends OmitType(AttributeVariantDto, [
  'variantId',
] as const) {}
