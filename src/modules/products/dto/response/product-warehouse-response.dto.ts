import { ApiProperty } from '@nestjs/swagger';
import { ProductWarehouseResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class ProductWarehouseResponseDto implements ProductWarehouseResponse {
  @ApiProperty(DESCRIPTION.WAREHOUSE_ID)
  readonly warehouseId: string;

  @ApiProperty(DESCRIPTION.TOTAL_QUANTITY)
  readonly totalQuantity: string | null;
}
