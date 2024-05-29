import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { SupplierResponseDto } from './supplier-response.dto';
import {
  GetSuppliersResponse,
  SupplierEntityResponse,
} from '../../interfaces/response.interface';

export class GetSuppliersResponseDto
  extends PaginationDto
  implements GetSuppliersResponse
{
  @ApiProperty({
    type: [SupplierResponseDto],
    description: 'List of suppliers',
  })
  readonly data: SupplierEntityResponse[];
}
