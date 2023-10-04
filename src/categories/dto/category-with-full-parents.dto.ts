import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  ICategory,
  ICategoryWithFullParentsDto,
} from '../interfaces/categories.interfaces';
import { CategoryDto } from './category.dto';

export class CategoryWithFullParentsDto
  extends OmitType(CategoryDto, ['parentIds'] as const)
  implements ICategoryWithFullParentsDto
{
  @ApiProperty({
    type: [CategoryDto],
    description: 'Parent categorise with full data',
    nullable: true,
    default: [],
  })
  readonly parents: ICategory[] = [];
}
