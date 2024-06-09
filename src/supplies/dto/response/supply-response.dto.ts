import { ApiProperty } from '@nestjs/swagger';
import {
  SupplyProductResponse,
  SupplyResponseEntity,
} from '../../interfaces/response.interface';
import { ObjectId } from 'mongodb';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { SupplyProductResponseDto } from './supply-product-response.dto';

export class SupplyResponseDto implements SupplyResponseEntity {
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: ObjectId;

  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string | null = null;

  @ApiProperty({
    ...DESCRIPTION.PRODUCTS,
    type: [SupplyProductResponseDto],
  })
  readonly products: SupplyProductResponse[];

  @ApiProperty(DESCRIPTION.PRODUCTS_TOTAL_COST)
  readonly productsTotalCost: string;

  @ApiProperty(DESCRIPTION.SUPPLIER_ID)
  readonly supplierId: string;

  @ApiProperty(DESCRIPTION.WAREHOUSE_ID)
  readonly warehouseId: string;

  @ApiProperty(DESCRIPTION.CREATED_AT)
  readonly createdAt: Date;
}
