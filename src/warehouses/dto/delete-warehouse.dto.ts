import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IWarehouseDelete } from '../interfaces/warehouses.interfaces';

export class DeleteWarehouseDto implements IWarehouseDelete {
  @IsMongoId()
  @ApiProperty({
    description: 'Warehouse identifier',
  })
  readonly id: string;
}
