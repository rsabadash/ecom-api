import { ApiProperty } from '@nestjs/swagger';
import { PaginationData } from '../../common/interfaces/pagination.interface';
import { ICategoryDto } from '../interfaces/categories.interfaces';
import { CategoryDto } from './category.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class PaginationCategoryDto
  extends PaginationDto
  implements PaginationData<ICategoryDto>
{
  @ApiProperty({
    type: [CategoryDto],
    description: 'List of items',
  })
  readonly data: ICategoryDto[];
}
