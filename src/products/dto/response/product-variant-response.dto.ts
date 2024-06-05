import { ApiProperty } from '@nestjs/swagger';
import { ProductVariantResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class ProductVariantResponseDto implements ProductVariantResponse {
  @ApiProperty(DESCRIPTION.VARIANT_ID)
  readonly variantId: string;

  @ApiProperty(DESCRIPTION.VARIANT_NAME)
  readonly name: string;
}
