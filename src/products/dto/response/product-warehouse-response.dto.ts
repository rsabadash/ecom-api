import { ApiProperty } from '@nestjs/swagger';
import { ProductWarehouseResponse } from '../../interfaces/response.interface';

export class ProductWarehouseResponseDto implements ProductWarehouseResponse {
  @ApiProperty({ description: 'Warehouse identifier' })
  readonly warehouseId: string;

  @ApiProperty({
    description: 'Quantity of product in warehouse',
    nullable: true,
    default: null,
  })
  readonly totalQuantity: null | string = null;
}
