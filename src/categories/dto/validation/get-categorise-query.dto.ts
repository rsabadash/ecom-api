import { GetCategoriseQuery } from '../../interfaces/query.interface';
import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { ParentIds } from '../../enums/parent-ids.enum';
import { Type } from 'class-transformer';

export class GetCategoriseQueryDto implements GetCategoriseQuery {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly page?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly limit?: number;

  @IsString()
  @IsOptional()
  readonly ids?: string;

  @IsEnum(ParentIds)
  @IsOptional()
  readonly parentIds?: ParentIds;
}
