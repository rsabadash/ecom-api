import { OmitType, PartialType } from '@nestjs/swagger';
import { VariantDto } from './variant.dto';

export class UpdateVariantDto extends PartialType(
  OmitType(VariantDto, ['attributeId'] as const),
) {}
