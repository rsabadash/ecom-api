import { ObjectId } from 'mongodb';

export interface ISupplier {
  _id: ObjectId;
  name: string;
  note: null | string;
  address: null | string;
  phoneNumber: null | string;
}

export interface IUpdateSupplier extends Omit<ISupplier, '_id'> {
  id: string;
}

export interface IDeleteSupplier {
  id: string;
}
