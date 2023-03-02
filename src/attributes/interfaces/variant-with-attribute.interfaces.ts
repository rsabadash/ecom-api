import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';

export interface IVariantWithAttribute {
  variantId: ObjectId;
  attributeId: ObjectId;
  attributeName: Translations;
  name: Translations;
  isActive: boolean;
  sortOrder: number;
}
