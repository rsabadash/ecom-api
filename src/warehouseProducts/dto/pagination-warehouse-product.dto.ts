import { ApiProperty } from '@nestjs/swagger';
import { PaginationData } from '../../common/interfaces/pagination.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IWarehouseProductDto } from '../interfaces/warehouse-products.interfaces';
import { WarehouseProductDto } from './warehouse-product.dto';

export class PaginationWarehouseProductDto
  extends PaginationDto
  implements PaginationData<IWarehouseProductDto>
{
  @ApiProperty({
    type: [WarehouseProductDto],
    description: 'List of items',
  })
  readonly data: IWarehouseProductDto[];
}
