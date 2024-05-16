import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IProductAttribute,
  IProductVariant,
} from '../interfaces/products.interfaces';
import { VariantProductDto } from './variant-product.dto';

export class AttributeProductDto implements IProductAttribute {
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of attribute related to product',
  })
  readonly attributeId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product attribute name',
  })
  readonly name: string;

  @ValidateNested({ each: true })
  @Type(() => VariantProductDto)
  @ApiProperty({
    type: [VariantProductDto],
    description: 'Variants for product',
  })
  readonly variants: IProductVariant[];
}
