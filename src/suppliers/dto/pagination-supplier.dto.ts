import { ApiProperty } from '@nestjs/swagger';
import { PaginationData } from '../../common/interfaces/pagination.interface';
import { SupplierDto } from './supplier.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ISupplierDto } from '../interfaces/suppliers.interfaces';

export class PaginationSupplierDto
  extends PaginationDto
  implements PaginationData<ISupplierDto>
{
  @ApiProperty({
    type: [SupplierDto],
    description: 'List of items',
  })
  readonly data: ISupplierDto[];
}
