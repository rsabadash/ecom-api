import { ApiProperty } from '@nestjs/swagger';
import { SupplyProductResponseDto } from './supply-product-response.dto';
import {
  GetSupplyResponse,
  SupplyProductResponse,
} from '../../interfaces/response.interface';
import { ObjectId } from 'mongodb';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class GetSupplyResponseDto implements GetSupplyResponse {
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: ObjectId;

  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string | null;

  @ApiProperty({
    ...DESCRIPTION.PRODUCTS,
    type: [SupplyProductResponseDto],
  })
  readonly products: SupplyProductResponse[];

  @ApiProperty(DESCRIPTION.TOTAL_COST)
  readonly productsTotalCost: string;

  @ApiProperty(DESCRIPTION.SUPPLIER_ID)
  readonly supplierId: string;

  @ApiProperty(DESCRIPTION.WAREHOUSE_ID)
  readonly warehouseId: string;

  @ApiProperty(DESCRIPTION.CREATED_AT)
  readonly createdAt: Date;
}
