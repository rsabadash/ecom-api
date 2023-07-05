import { OmitType } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { ICategoryCreate } from '../interfaces/categories.interfaces';

export class CreateCategoryDto
  extends OmitType(CategoryDto, ['_id'] as const)
  implements ICategoryCreate {}
