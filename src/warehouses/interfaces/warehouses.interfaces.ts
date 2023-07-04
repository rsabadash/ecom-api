import { ObjectId } from 'mongodb';
import { WarehouseType } from '../enums/warehouse-types';

export interface IWarehouse {
  _id: ObjectId;
  name: string;
  type: WarehouseType;
  address: string | null;
}

export interface IWarehouseCreate
  extends Pick<IWarehouse, 'name' | 'type' | 'address'> {}

export interface IWarehouseUpdate
  extends Partial<Pick<IWarehouse, 'name' | 'type' | 'address'>> {
  id: string;
}

export interface IWarehouseDelete {
  id: string;
}

export interface GetWarehouseParameters {
  warehouseId: string;
}
