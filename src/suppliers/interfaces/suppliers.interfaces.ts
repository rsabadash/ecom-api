import { ObjectId } from 'mongodb';

export interface ISupplier {
  _id: ObjectId;
  name: string;
  note: string | null;
  address: string | null;
  phoneNumber: string | null;
}

export interface IUpdateSupplier extends Omit<ISupplier, '_id'> {
  id: string;
}

export interface IDeleteSupplier {
  id: string;
}
