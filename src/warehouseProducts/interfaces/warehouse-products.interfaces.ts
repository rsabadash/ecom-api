import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';
import { Unit } from '../enums/unit.enums';
import {
  ATTRIBUTE_ID,
  SUPPLY_IDS,
  VARIANT_ID,
  WAREHOUSE_ID,
} from '../../common/constants/cross-entity-id.constants';

export interface IWarehouseProductVariant {
  [VARIANT_ID]: string;
  name: Translations;
}

export interface IWarehouseProductAttribute {
  [ATTRIBUTE_ID]: string;
  name: Translations;
  variants: IWarehouseProductVariant[];
}

export interface IWarehouseProductWarehouses {
  [WAREHOUSE_ID]: string;
  totalQuantity: string | null;
}

export interface IWarehouseProduct {
  _id: ObjectId;
  name: Translations;
  sku: string;
  unit: Unit;
  attributes: IWarehouseProductAttribute[];
  createdAt: Date;
  [SUPPLY_IDS]: string[];
  warehouses: IWarehouseProductWarehouses[];
  isDeleted: boolean;
}

export interface IWarehouseProductDto extends Omit<IWarehouseProduct, '_id'> {
  _id: string;
}

export interface IWarehouseProductCreate
  extends Omit<
    IWarehouseProduct,
    | '_id'
    | 'createdAt'
    | 'attributes'
    | 'supplyIds'
    | 'warehouses'
    | 'isDeleted'
  > {
  attributes: null | Omit<IWarehouseProductAttribute, 'name'>[];
}

export interface INewWarehouseProduct extends Omit<IWarehouseProduct, '_id'> {}
