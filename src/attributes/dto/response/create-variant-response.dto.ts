import { CreateVariantResponse } from '../../interfaces/response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class CreateVariantResponseDto implements CreateVariantResponse {
  @ApiProperty(DESCRIPTION.VARIANT_ID)
  readonly variantId: string;

  @ApiProperty(DESCRIPTION.VARIANT_NAME)
  readonly name: string;

  @ApiProperty(DESCRIPTION.SEO_NAME)
  readonly seoName: string;

  @ApiProperty(DESCRIPTION.VARIANT_IS_ACTIVE)
  readonly isActive: boolean;

  @ApiProperty(DESCRIPTION.ATTRIBUTE_ID)
  readonly attributeId: string;
}
