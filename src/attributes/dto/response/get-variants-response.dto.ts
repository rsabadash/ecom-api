import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import {
  GetVariantsResponse,
  VariantWithAttributeEntityResponse,
} from '../../interfaces/response.interface';
import { VariantWithAttributeResponseDto } from './variant-with-attribute-response.dto';

export class GetVariantsResponseDto
  extends PaginationDto
  implements GetVariantsResponse
{
  @ApiProperty({
    type: [VariantWithAttributeResponseDto],
    description: 'List of variants',
  })
  readonly data: VariantWithAttributeEntityResponse[];
}
