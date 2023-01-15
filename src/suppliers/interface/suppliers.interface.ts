import { ObjectId } from 'mongodb';

export interface ISuppliers {
  id?: ObjectId;
  name: string;
  note?: string;
  accountId?: ObjectId | string;
  address?: string;
  phoneNumber?: string;
}

export interface IDeleteSupplier {
  id: string;
}
