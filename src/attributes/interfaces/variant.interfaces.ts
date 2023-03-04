import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';

export interface IVariant {
  variantId: ObjectId;
  seoName: string;
  name: Translations;
  isActive: boolean;
  sortOrder: number;
}

export interface ICreateVariant extends IVariant {
  attributeId: ObjectId;
}
