import {
  CategoryEntityResponse,
  CreateCategoryResponse,
} from '../../interfaces/response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { CategoryResponseDto } from './category-response.dto';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class CreateCategoryResponseDto implements CreateCategoryResponse {
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

  @ApiProperty({
    ...DESCRIPTION.PARENTS,
    type: [CategoryResponseDto],
  })
  readonly parents: CategoryEntityResponse[];
}
