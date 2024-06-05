import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import {
  GetProductsResponse,
  ProductEntityResponse,
} from '../../interfaces/response.interface';
import { ProductResponseDto } from './product-response.dto';

export class GetProductsResponseDto
  extends PaginationDto
  implements GetProductsResponse
{
  @ApiProperty({
    type: [ProductResponseDto],
    description: 'List of products',
  })
  readonly data: ProductEntityResponse[];
}
