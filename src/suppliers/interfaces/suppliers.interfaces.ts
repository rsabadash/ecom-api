import { ObjectId } from 'mongodb';

export interface ISupplier {
  _id: ObjectId;
  name: string;
  address: null | string;
  phoneNumber: null | string;
}

export interface ISupplierDto extends Omit<ISupplier, '_id'> {
  _id: string;
}

export interface ISupplierCreate extends Omit<ISupplier, '_id'> {}

export interface ISupplierUpdate extends Partial<Omit<ISupplier, '_id'>> {
  id: string;
}

export interface ISupplierDelete {
  id: string;
}

export interface GetSupplierParameters {
  supplierId: string;
}
