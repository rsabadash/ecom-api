import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  AttributeWarehouseProductDto,
  WarehouseProductDto,
} from './warehouse-product.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IWarehouseProductAttribute } from '../interfaces/warehouse-products.interfaces';

class AttributeWarehouseProductCreateDto extends OmitType(
  AttributeWarehouseProductDto,
  ['name'] as const,
) {}

export class CreateWarehouseProductDto extends OmitType(WarehouseProductDto, [
  '_id',
  'groupId',
  'createdDate',
  'attributes',
] as const) {
  @ValidateNested({ each: true })
  @Type(() => AttributeWarehouseProductCreateDto)
  @ApiProperty({
    type: [AttributeWarehouseProductCreateDto],
    description: 'Attributes for the warehouse product',
    nullable: true,
    default: null,
  })
  readonly attributes: null | Omit<IWarehouseProductAttribute, 'name'>[] = null;
}
