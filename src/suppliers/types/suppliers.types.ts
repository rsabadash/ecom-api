import { SuppliersInterface } from '../interface/suppliers.interface';
import { ObjectId } from 'mongodb';

export type SuppliersEntity = SuppliersInterface;

export type GetSupplierOpts = {
  supplierId: ObjectId | string;
};
