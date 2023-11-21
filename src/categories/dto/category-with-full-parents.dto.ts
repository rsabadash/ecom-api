import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  ICategory,
  ICategoryWithFullParentsDto,
} from '../interfaces/categories.interfaces';
import { CategoryDto } from './category.dto';

export class CategoryWithFullParentsDto
  extends OmitType(CategoryDto, ['parentIdsHierarchy'] as const)
  implements ICategoryWithFullParentsDto
{
  @ApiProperty({
    type: [CategoryDto],
    description: 'Parent categories with full data in hierarchy order',
    default: [],
  })
  readonly parents: ICategory[] = [];
}
