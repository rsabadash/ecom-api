import { IWarehouseProductWarehouses } from '../interfaces/warehouse-products.interfaces';
import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WarehouseProductWarehousesDto
  implements IWarehouseProductWarehouses
{
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of a warehouses',
  })
  readonly warehouseId: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'Quantity of the product in the warehouse',
    nullable: true,
    default: null,
  })
  readonly totalQuantity: null | string = null;
}
