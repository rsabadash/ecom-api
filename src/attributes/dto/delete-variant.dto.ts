import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IVariantDelete } from '../interfaces/variant.interfaces';

export class DeleteVariantDto implements IVariantDelete {
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
