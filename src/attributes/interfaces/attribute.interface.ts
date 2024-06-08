import { ObjectId } from 'mongodb';
import { IVariant, VariantEntity } from './variant.interface';

export interface AttributeEntity {
  _id: ObjectId;
  name: string;
  seoName: string;
  isActive: boolean;
  variants: VariantEntity[] | null;
}

export interface CreateAttribute {
  name: string;
  seoName: string;
  isActive: boolean;
  variants: IVariant[] | null;
}

export interface UpdateAttribute {
  id: string;
  name?: string;
  seoName?: string;
  isActive?: boolean;
}

export interface DeleteAttribute {
  id: string;
}

export interface GetAttributeParameters {
  attributeId: string;
}
