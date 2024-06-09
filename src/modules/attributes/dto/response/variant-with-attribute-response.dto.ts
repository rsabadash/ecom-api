import { ApiProperty } from '@nestjs/swagger';
import { VariantWithAttributeEntityResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { ObjectId } from 'mongodb';

export class VariantWithAttributeResponseDto
  implements VariantWithAttributeEntityResponse
{
  @ApiProperty(DESCRIPTION.VARIANT_ID)
  readonly variantId: string;

  @ApiProperty(DESCRIPTION.VARIANT_NAME)
  readonly name: string;

  @ApiProperty(DESCRIPTION.SEO_NAME)
  readonly seoName: string;

  @ApiProperty(DESCRIPTION.VARIANT_IS_ACTIVE)
  readonly isActive: boolean;

  @ApiProperty(DESCRIPTION.ATTRIBUTE_ID)
  readonly attributeId: ObjectId;

  @ApiProperty(DESCRIPTION.ATTRIBUTE_NAME)
  readonly attributeName: string;
}
