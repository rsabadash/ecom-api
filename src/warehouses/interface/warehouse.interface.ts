import { ObjectId } from 'mongodb';
import { WarehouseType } from '../enums/warehouse-types.enum';

export interface WarehouseEntity {
  _id: ObjectId;
  name: string;
  type: WarehouseType;
  address: string | null;
}

export interface CreateWarehouse {
  name: string;
  type: WarehouseType;
  address: string | null;
}

export interface UpdateWarehouse {
  id: string;
  name?: string;
  type?: WarehouseType;
  address?: string | null;
}

export interface DeleteWarehouse {
  id: string;
}

export interface GetWarehouseParameters {
  warehouseId: string;
}
