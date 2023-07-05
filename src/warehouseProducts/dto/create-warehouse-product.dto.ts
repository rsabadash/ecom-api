import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WarehouseProductDto } from './warehouse-product.dto';
import {
  IWarehouseProductCreate,
  IWarehouseProductAttribute,
} from '../interfaces/warehouse-products.interfaces';
import { AttributeWarehouseProductDto } from './attribute-warehouse-product.dto';

class AttributeWarehouseProductCreateDto extends OmitType(
  AttributeWarehouseProductDto,
  ['name'] as const,
) {}

export class CreateWarehouseProductDto
  extends OmitType(WarehouseProductDto, [
    '_id',
    'createdDate',
    'attributes',
    'supplyIds',
    'warehouses',
    'isDeleted',
  ] as const)
  implements IWarehouseProductCreate
{
  @ValidateNested({ each: true })
  @Type(() => AttributeWarehouseProductCreateDto)
  @ApiProperty({
    type: [AttributeWarehouseProductCreateDto],
    description: 'Attributes for the warehouse product',
    default: [],
  })
  readonly attributes: Omit<IWarehouseProductAttribute, 'name'>[] = [];
}
