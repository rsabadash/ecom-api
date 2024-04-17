import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';
import { Unit } from '../enums/unit.enums';
import {
  ATTRIBUTE_ID,
  SUPPLY_IDS,
  VARIANT_ID,
  WAREHOUSE_ID,
} from '../../common/constants/cross-entity-id.constants';

export interface IProductVariant {
  [VARIANT_ID]: string;
  name: Translations;
}

export interface IProductAttribute {
  [ATTRIBUTE_ID]: string;
  name: Translations;
  variants: IProductVariant[];
}

export interface IProductWarehouses {
  [WAREHOUSE_ID]: string;
  totalQuantity: string | null;
}

export interface IProduct {
  _id: ObjectId;
  name: string;
  sku: string;
  unit: Unit;
  attributes: IProductAttribute[];
  createdAt: Date;
  [SUPPLY_IDS]: string[];
  warehouses: IProductWarehouses[];
  isDeleted: boolean;
}

export interface IProductDto extends Omit<IProduct, '_id'> {
  _id: string;
}

export interface IProductCreate
  extends Omit<
    IProduct,
    | '_id'
    | 'createdAt'
    | 'attributes'
    | 'supplyIds'
    | 'warehouses'
    | 'isDeleted'
  > {
  attributes: null | Omit<IProductAttribute, 'name'>[];
}

export interface INewProduct extends Omit<IProduct, '_id'> {}
