import { DropdownListQuery } from '../../interfaces/dropdown-list.interface';
import { IsMongoId, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DropdownListQueryDto implements DropdownListQuery {
  @IsMongoId()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Entity identifier' })
  readonly _id?: string;
}
