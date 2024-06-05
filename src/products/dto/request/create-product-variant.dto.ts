import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { CreateProductVariant } from '../../interfaces/products.interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class CreateProductVariantDto implements CreateProductVariant {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.VARIANT_ID)
  readonly variantId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.VARIANT_NAME)
  readonly name: string;
}
