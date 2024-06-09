import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { DeleteVariant } from '../../interfaces/variant.interface';

export class DeleteVariantDto implements DeleteVariant {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.VARIANT_ID)
  readonly variantId: string;

  @IsMongoId()
  @ApiProperty(DESCRIPTION.ATTRIBUTE_ID)
  readonly attributeId: string;
}
