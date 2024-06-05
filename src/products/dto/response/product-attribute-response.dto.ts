import { ApiProperty } from '@nestjs/swagger';
import {
  ProductAttributeResponse,
  ProductVariantResponse,
} from '../../interfaces/response.interface';
import { ProductVariantResponseDto } from './product-variant-response.dto';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class ProductAttributeResponseDto implements ProductAttributeResponse {
  @ApiProperty(DESCRIPTION.ATTRIBUTE_ID)
  readonly attributeId: string;

  @ApiProperty(DESCRIPTION.ATTRIBUTE_NAME)
  readonly name: string;

  @ApiProperty({
    ...DESCRIPTION.VARIANTS,
    type: [ProductVariantResponseDto],
  })
  readonly variants: ProductVariantResponse[];
}
