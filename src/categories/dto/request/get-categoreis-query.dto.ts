import { GetCategoriesQuery } from '../../interfaces/query.interface';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ParentIds } from '../../enums/parent-ids.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationParsedQueryDto } from '../../../common/dto/request/pagination-parsed-query.dto';

export class GetCategoriesQueryDto
  extends PaginationParsedQueryDto
  implements GetCategoriesQuery
{
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Separated by comma ids that should be retrieved',
    example: '123,654,789',
  })
  readonly ids?: string;

  @IsEnum(ParentIds)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Retrieve only first level categories',
    enum: ParentIds,
    example: [ParentIds.Root],
  })
  readonly parentIds?: ParentIds;
}
