import { OmitType, PartialType } from '@nestjs/swagger';
import { AttributeVariantDto } from './attribute-variant.dto';

export class UpdateAttributeVariantDto extends PartialType(
  OmitType(AttributeVariantDto, ['attributeId'] as const),
) {}
