import { ApiProperty } from '@nestjs/swagger';
import { SupplyProductResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class SupplyProductResponseDto implements SupplyProductResponse {
  @ApiProperty(DESCRIPTION.PRODUCT_ID)
  readonly productId: string;

  @ApiProperty(DESCRIPTION.PRODUCT_NAME)
  readonly productName: string;

  @ApiProperty(DESCRIPTION.QUANTITY)
  readonly quantity: string;

  @ApiProperty(DESCRIPTION.PRICE)
  readonly price: string;

  @ApiProperty(DESCRIPTION.TOTAL_COST)
  readonly totalCost: string;

  @ApiProperty(DESCRIPTION.ATTRIBUTE_IDS)
  readonly attributeIds: string[];

  @ApiProperty(DESCRIPTION.VARIANT_IDS)
  readonly variantIds: string[] = [];
}
