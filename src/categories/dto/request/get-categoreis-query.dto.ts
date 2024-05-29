import { GetCategoriseQuery } from '../../interfaces/query.interface';
import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { ParentIds } from '../../enums/parent-ids.enum';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DESCRIPTION_COMMON } from '../../../common/constants/swagger.constants';

export class GetCategoriesQueryDto implements GetCategoriseQuery {
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
