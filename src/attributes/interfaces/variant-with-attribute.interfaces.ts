import { ObjectId } from 'mongodb';
import { IVariant } from './variant.interfaces';

export interface IVariantWithAttribute extends IVariant {
  attributeId: ObjectId;
  attributeName: string;
}

export interface IVariantWithAttributeDto
  extends Omit<IVariantWithAttribute, 'attributeId'> {
  attributeId: string;
}
