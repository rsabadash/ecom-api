import { ApiProperty } from '@nestjs/swagger';
import {
  ProductAttributeResponse,
  ProductVariantResponse,
} from '../../interfaces/response.interface';
import { ProductVariantResponseDto } from './product-variant-response.dto';

export class ProductAttributeResponseDto implements ProductAttributeResponse {
  @ApiProperty({ description: 'Attribute identifier related to product' })
  readonly attributeId: string;

  @ApiProperty({ description: 'Attribute name related to product' })
  readonly name: string;

  @ApiProperty({
    type: [ProductVariantResponseDto],
    description: 'Product variants',
  })
  readonly variants: ProductVariantResponse[];
}
