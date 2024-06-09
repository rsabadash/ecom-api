import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntityResponse } from '../../interfaces/response.interface';
import { ObjectId } from 'mongodb';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class CategoryResponseDto implements CategoryEntityResponse {
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: ObjectId;

  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string;

  @ApiProperty(DESCRIPTION.SEO_NAME)
  readonly seoName: string;

  @ApiProperty(DESCRIPTION.IS_ACTIVE)
  readonly isActive: boolean;

  @ApiProperty(DESCRIPTION.CHILDREN_IDS)
  readonly childrenIds: string[];

  @ApiProperty(DESCRIPTION.PARENT_IDS_HIERARCHY)
  readonly parentIdsHierarchy: string[];
}
