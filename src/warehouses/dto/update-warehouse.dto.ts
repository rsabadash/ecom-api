import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { WarehouseDto } from './warehouse.dto';
import { IWarehouseUpdate } from '../interfaces/warehouses.interfaces';

export class UpdateWarehouseDto
  extends PartialType(OmitType(WarehouseDto, ['_id'] as const))
  implements IWarehouseUpdate
{
  @IsMongoId()
  @ApiProperty({
    description: 'Warehouse identifier',
  })
  readonly id: string;
}
