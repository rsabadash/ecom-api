import { IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateProductAttribute,
  CreateProductVariant,
} from '../../interfaces/products.interfaces';
import { CreateProductVariantDto } from './create-product-variant.dto';

export class CreateProductAttributeDto implements CreateProductAttribute {
  @IsMongoId()
  readonly attributeId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  readonly variants: CreateProductVariant[];
}
