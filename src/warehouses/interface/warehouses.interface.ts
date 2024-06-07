import { ObjectId } from 'mongodb';
import { WarehouseType } from '../enums/warehouse-types';

export interface WarehouseEntity {
  _id: ObjectId;
  name: string;
  type: WarehouseType;
  address: string | null;
}

export interface WarehouseCreate
  extends Pick<WarehouseEntity, 'name' | 'type' | 'address'> {}

export interface IWarehouse {
  _id: ObjectId;
  name: string;
  type: WarehouseType;
  address: string | null;
}

export interface WarehouseUpdate {
  id: string;
  name?: string;
  type?: WarehouseType;
  address?: string | null;
}

export interface WarehouseDelete {
  id: string;
}

export interface GetWarehouseParameters {
  warehouseId: string;
}
