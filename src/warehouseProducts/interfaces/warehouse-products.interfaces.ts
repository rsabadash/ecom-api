import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';

export interface IWarehouseProductVariant {
  variantId: string;
  name: Translations;
}

export interface IWarehouseProductAttribute {
  attributeId: string;
  name: Translations;
  variants: IWarehouseProductVariant[];
}

export interface IWarehouseProduct {
  _id: ObjectId;
  name: Translations;
  sku: string;
  attributes: null | IWarehouseProductAttribute[];
  groupId: null | ObjectId;
  groupName: null | string;
  createdAt: Date;
}

export interface ICreateWarehouseProduct
  extends Omit<
    IWarehouseProduct,
    '_id' | 'groupId' | 'createdAt' | 'attributes'
  > {
  attributes: null | Omit<IWarehouseProductAttribute, 'name'>[];
}

export interface IUpdatedWarehouseProduct
  extends Omit<IWarehouseProduct, '_id'> {}
