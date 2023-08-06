import { ApiProperty } from '@nestjs/swagger';
import { PaginationData } from '../../common/interfaces/pagination.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ISupplyDto } from '../interfaces/supplies.interfaces';
import { SupplyDto } from './supply.dto';

export class PaginationSupplyDto
  extends PaginationDto
  implements PaginationData<ISupplyDto>
{
  @ApiProperty({
    type: [SupplyDto],
    description: 'List of items',
  })
  readonly data: ISupplyDto[];
}
