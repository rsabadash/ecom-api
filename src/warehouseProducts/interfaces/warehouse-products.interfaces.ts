import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';
import { Unit } from '../enums/unit.enums';

export interface IWarehouseProductVariant {
  variantId: string;
  name: Translations;
}

export interface IWarehouseProductAttribute {
  attributeId: string;
  name: Translations;
  variants: null | IWarehouseProductVariant[];
}

export interface IWarehouseProduct {
  _id: ObjectId;
  name: Translations;
  sku: string;
  unit: Unit;
  attributes: null | IWarehouseProductAttribute[];
  groupId: null | ObjectId;
  groupName: null | string;
  createdDate: Date;
  supplyIds: string[];
  warehouses: IWarehouseProductWarehouses[];
}

export interface IWarehouseProductWarehouses {
  warehouseId: string;
  totalQuantity: string | null;
}

export interface ICreateWarehouseProduct
  extends Omit<
    IWarehouseProduct,
    '_id' | 'groupId' | 'createdDate' | 'attributes' | 'supplies' | 'warehouses'
  > {
  attributes: null | Omit<IWarehouseProductAttribute, 'name'>[];
}

export interface INewWarehouseProduct extends Omit<IWarehouseProduct, '_id'> {}
