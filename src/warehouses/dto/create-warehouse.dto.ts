import { OmitType } from '@nestjs/swagger';
import { WarehouseDto } from './warehouse.dto';

export class CreateWarehouseDto extends OmitType(WarehouseDto, [
  '_id',
] as const) {}
