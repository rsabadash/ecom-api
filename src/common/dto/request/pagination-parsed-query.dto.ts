import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DESCRIPTION_COMMON } from '../../constants/swagger.constants';
import { PaginationParsedQuery } from '../../types/query.types';

export class PaginationParsedQueryDto implements PaginationParsedQuery {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION_COMMON.LIMIT)
  readonly limit?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION_COMMON.PAGE)
  readonly page?: number;
}
