import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';

export interface IVariant {
  variantId: ObjectId;
  attributeId: ObjectId;
  name: Translations;
  isActive: boolean;
  sortOrder: number;
}
