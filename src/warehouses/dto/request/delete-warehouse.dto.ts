import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WarehouseDelete } from '../../interface/warehouses.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class DeleteWarehouseDto implements WarehouseDelete {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ID)
  readonly id: string;
}
