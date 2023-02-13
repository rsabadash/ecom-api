import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';
import { IAttributeVariant } from './attribute-variant.interfaces';

export interface IAttribute {
  _id: ObjectId;
  name: Translations;
  isActive: boolean;
  sortOrder: number;
  variants: IAttributeVariant[];
}

export interface IUpdateAttribute extends Omit<IAttribute, '_id' | 'variants'> {
  id: string;
}

export interface IDeleteAttribute {
  id: string;
}
