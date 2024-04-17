import { ApiProperty } from '@nestjs/swagger';
import { PaginationData } from '../../common/interfaces/pagination.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IProductDto } from '../interfaces/products.interfaces';
import { ProductDto } from './product.dto';

export class PaginationProductDto
  extends PaginationDto
  implements PaginationData<IProductDto>
{
  @ApiProperty({
    type: [ProductDto],
    description: 'List of items',
  })
  readonly data: IProductDto[];
}
