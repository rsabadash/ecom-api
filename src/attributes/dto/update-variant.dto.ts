import { IsMongoId } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { VariantDto } from './variant.dto';
import { IVariantUpdate } from '../interfaces/variant.interfaces';

export class UpdateVariantDto
  extends PartialType(OmitType(VariantDto, ['variantId'] as const))
  implements IVariantUpdate
{
  @IsMongoId()
  @ApiProperty({
    description: 'Attribute identifier',
  })
  readonly attributeId: string;

  @IsMongoId()
  @ApiProperty({
    description: 'Variant identifier',
  })
  readonly variantId: string;
}
