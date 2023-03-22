import { ObjectId } from 'mongodb';
import { WarehouseType } from '../enums/warehouse-types';

export interface IWarehouse {
  _id: ObjectId;
  name: string;
  type: WarehouseType;
  address: string | null;
}
