import { ApiProperty } from '@nestjs/swagger';
import { PaginationData } from '../../common/interfaces/pagination.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IVariantWithAttributeDto } from '../interfaces/variant-with-attribute.interfaces';
import { VariantWithAttributeDto } from './variant-with-attribute.dto';

export class PaginationVariantWithAttributeDto
  extends PaginationDto
  implements PaginationData<IVariantWithAttributeDto>
{
  @ApiProperty({
    type: [VariantWithAttributeDto],
    description: 'List of items',
  })
  readonly data: IVariantWithAttributeDto[];
}
