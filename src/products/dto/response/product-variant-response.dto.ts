import { ApiProperty } from '@nestjs/swagger';
import { ProductVariantResponse } from '../../interfaces/response.interface';

export class ProductVariantResponseDto implements ProductVariantResponse {
  @ApiProperty({ description: 'Variant identifier related to product' })
  readonly variantId: string;

  @ApiProperty({ description: 'Variant name related to product' })
  readonly name: string;
}
