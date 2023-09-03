import {
  PaginationData,
  PaginationMetaData,
} from '../interfaces/pagination.interface';
import { ApiProperty } from '@nestjs/swagger';

class PaginationMetaDto implements PaginationMetaData {
  @ApiProperty({
    description: 'Total number of all items',
  })
  readonly total: number;
}

export class PaginationDto implements PaginationData<unknown> {
  @ApiProperty({
    type: [],
    description: 'List of items',
  })
  declare data: unknown[];

  @ApiProperty({
    type: PaginationMetaDto,
    description: 'Pagination metadata',
  })
  readonly metadata: PaginationMetaDto;
}
