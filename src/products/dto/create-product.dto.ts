import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './product.dto';
import {
  IProductCreate,
  IProductAttribute,
} from '../interfaces/products.interfaces';
import { AttributeProductDto } from './attribute-product.dto';

class AttributeProductCreateDto extends OmitType(
  AttributeProductDto,
  ['name'] as const,
) {}

export class CreateProductDto
  extends OmitType(ProductDto, [
    '_id',
    'createdAt',
    'attributes',
    'supplyIds',
    'warehouses',
    'isDeleted',
  ] as const)
  implements IProductCreate
{
  @ValidateNested({ each: true })
  @Type(() => AttributeProductCreateDto)
  @ApiProperty({
    type: [AttributeProductCreateDto],
    description: 'Attributes for product',
    nullable: true,
    default: [],
  })
  readonly attributes: Omit<IProductAttribute, 'name'>[] = [];
}
