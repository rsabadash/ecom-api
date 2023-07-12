import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';
import { IVariant } from './variant.interfaces';

export interface IAttribute {
  _id: ObjectId;
  name: Translations;
  seoName: string;
  isActive: boolean;
  sortOrder: null | number;
  variants: IVariant[];
}

export interface IAttributeCreate extends Omit<IAttribute, '_id'> {}

export interface IAttributeUpdate
  extends Partial<Omit<IAttribute, '_id' | 'variants'>> {
  id: string;
}

export interface IAttributeDelete {
  id: string;
}
