import { WarehouseEntity } from './warehouse.interface';
import { DropdownListItem } from '../../../common/interfaces/dropdown-list.interface';

export interface WarehouseResponseEntity extends WarehouseEntity {}

export interface GetWarehousesResponse extends WarehouseResponseEntity {}

export interface GetWarehouseResponse extends WarehouseResponseEntity {}

export interface CreateWarehouseResponse extends WarehouseResponseEntity {}

export interface WarehouseDropdownListItem extends DropdownListItem {}
