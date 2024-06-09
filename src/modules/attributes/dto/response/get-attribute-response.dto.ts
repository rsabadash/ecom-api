import { GetAttributeResponse } from '../../interfaces/response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { ObjectId } from 'mongodb';
import { VariantEntity } from '../../interfaces/variant.interface';

export class GetAttributeResponseDto implements GetAttributeResponse {
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
