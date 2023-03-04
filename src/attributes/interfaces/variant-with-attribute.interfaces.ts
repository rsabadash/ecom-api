import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';
import { IVariant } from './variant.interfaces';

export interface IVariantWithAttribute extends IVariant {
  attributeId: ObjectId;
  attributeName: Translations;
}
