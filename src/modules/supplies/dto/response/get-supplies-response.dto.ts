import { PaginationDto } from '../../../../common/dto/response/pagination.dto';
import {
  GetSuppliesResponse,
  SupplyResponseEntity,
} from '../../interfaces/response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { SupplyResponseDto } from './supply-response.dto';

export class GetSuppliesResponseDto
  extends PaginationDto
  implements GetSuppliesResponse
{
  @ApiProperty({
    type: [SupplyResponseDto],
    description: 'List of supplies',
  })
  readonly data: SupplyResponseEntity[];
}
