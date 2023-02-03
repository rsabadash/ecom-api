import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';

export type AttributeVariantType = {
  attributeId: ObjectId;
  variantId: ObjectId;
  name: Translations;
  isActive: boolean;
  sortOrder: number;
};
