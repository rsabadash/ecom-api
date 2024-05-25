import { DropdownListQuery } from '../../interfaces/dropdown-list.interface';
import { IsMongoId, IsOptional } from 'class-validator';

export class DropdownListQueryDto implements DropdownListQuery {
  @IsOptional()
  @IsMongoId()
  readonly _id?: string;
}
