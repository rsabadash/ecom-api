import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  CategoryEntityResponse,
  GetCategoryResponse,
} from '../../interfaces/response.interface';
import { CategoryResponseDto } from './category-response.dto';

export class GetCategoryResponseDto
  extends OmitType(CategoryResponseDto, ['parentIdsHierarchy'] as const)
  implements GetCategoryResponse
{
  @ApiProperty({
    type: [CategoryResponseDto],
    description: 'Parent categories with full data in hierarchy order',
    default: [],
  })
  readonly parents: CategoryEntityResponse[];
}
