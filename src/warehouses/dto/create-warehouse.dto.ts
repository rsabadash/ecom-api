import { OmitType } from '@nestjs/swagger';
import { WarehouseDto } from './warehouse.dto';
import { IWarehouseCreate } from '../interfaces/warehouses.interfaces';

export class CreateWarehouseDto
  extends OmitType(WarehouseDto, ['_id'] as const)
  implements IWarehouseCreate {}
