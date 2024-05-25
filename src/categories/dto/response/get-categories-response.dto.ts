import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import {
  CategoryEntityResponse,
  GetCategoriesResponse,
} from '../../interfaces/response.interface';
import { CategoryResponseDto } from './category-response.dto';

export class GetCategoriesResponseDto
  extends PaginationDto
  implements GetCategoriesResponse
{
  @ApiProperty({
    type: [CategoryResponseDto],
    description: 'List of categories',
    default: [],
  })
  readonly data: CategoryEntityResponse[];
}
