import { ApiProperty } from '@nestjs/swagger';
import { VariantEntity } from '../../interfaces/variant.interface';
import { AttributeEntityResponse } from '../../interfaces/response.interface';
import { ObjectId } from 'mongodb';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class AttributeResponseDto implements AttributeEntityResponse {
  @ApiProperty(DESCRIPTION.ATTRIBUTE_ID)
  readonly _id: ObjectId;

  @ApiProperty(DESCRIPTION.ATTRIBUTE_NAME)
  readonly name: string;

  @ApiProperty(DESCRIPTION.SEO_NAME)
  readonly seoName: string;

  @ApiProperty(DESCRIPTION.IS_ACTIVE)
  readonly isActive: boolean;

  @ApiProperty(DESCRIPTION.VARIANTS)
  readonly variants: VariantEntity[];
}
