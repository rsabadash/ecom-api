import { IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateProductAttribute,
  CreateProductVariant,
} from '../../interfaces/products.interfaces';
import { CreateProductVariantDto } from './create-product-variant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class CreateProductAttributeDto implements CreateProductAttribute {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ATTRIBUTE_ID)
  readonly attributeId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  @ApiProperty(DESCRIPTION.VARIANTS)
  readonly variants: CreateProductVariant[];
}
