import { ISuppliers } from '../interface/suppliers.interface';
import { ObjectId } from 'mongodb';

export type SuppliersEntity = ISuppliers;

export type GetSupplierParameters = {
  supplierId: ObjectId;
};
