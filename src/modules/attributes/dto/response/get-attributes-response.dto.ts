import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../../common/dto/response/pagination.dto';
import {
  AttributeEntityResponse,
  GetAttributesResponse,
} from '../../interfaces/response.interface';
import { AttributeResponseDto } from './attribute-response.dto';

export class GetAttributesResponseDto
  extends PaginationDto
  implements GetAttributesResponse
{
  @ApiProperty({
    type: [AttributeResponseDto],
    description: 'List of attributes',
  })
  readonly data: AttributeEntityResponse[];
}
