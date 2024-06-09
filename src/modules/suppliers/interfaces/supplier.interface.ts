import { ObjectId } from 'mongodb';

export interface SupplierEntity {
  _id: ObjectId;
  name: string;
  address: string | null;
  phoneNumber: string | null;
}

export interface CreateSupplier {
  name: string;
  address: string | null;
  phoneNumber: string | null;
}

export interface UpdateSupplier {
  id: string;
  name?: string;
  address?: string | null;
  phoneNumber?: string | null;
}

export interface DeleteSupplier {
  id: string;
}

export interface GetSupplierParameters {
  supplierId: string;
}
