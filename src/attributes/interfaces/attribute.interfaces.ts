import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';
import { IVariant } from './variant.interfaces';

export interface IAttribute {
  _id: ObjectId;
  name: Translations;
  seoName: string;
  isActive: boolean;
  variants: IVariant[];
}

export interface IAttributeDto extends Omit<IAttribute, '_id'> {
  _id: string;
}

export interface IAttributeCreate extends Omit<IAttribute, '_id'> {}

export interface IAttributeUpdate
  extends Partial<Omit<IAttribute, '_id' | 'variants'>> {
  id: string;
}

export interface IAttributeDelete {
  id: string;
}

export interface GetAttributeParameters {
  attributeId: string;
}
