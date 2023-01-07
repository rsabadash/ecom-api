import { ObjectId } from 'mongodb';

export interface SuppliersInterface {
  _id?: ObjectId | string;
  name: string;
  note?: string;
  accountId?: ObjectId | string;
  address?: string;
  phoneNumber?: string;
}
