import { ApiProperty } from '@nestjs/swagger';
import { PaginationData } from '../../common/interfaces/pagination.interface';
import { AttributeDto } from './attribute.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IAttributeDto } from '../interfaces/attribute.interfaces';

export class PaginationAttributeDto
  extends PaginationDto
  implements PaginationData<IAttributeDto>
{
  @ApiProperty({
    type: [AttributeDto],
    description: 'List of items',
  })
  readonly data: IAttributeDto[];
}
