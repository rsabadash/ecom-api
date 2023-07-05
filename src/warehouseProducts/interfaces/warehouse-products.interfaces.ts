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
  variants: IWarehouseProductVariant[];
}

export interface IWarehouseProductWarehouses {
  warehouseId: string;
  totalQuantity: string | null;
}

export interface IWarehouseProduct {
  _id: ObjectId;
  name: Translations;
  sku: string;
  unit: Unit;
  attributes: IWarehouseProductAttribute[];
  createdDate: Date;
  supplyIds: string[];
  warehouses: IWarehouseProductWarehouses[];
  isDeleted: boolean;
}

export interface IWarehouseProductCreate
  extends Omit<
    IWarehouseProduct,
    | '_id'
    | 'createdDate'
    | 'attributes'
    | 'supplyIds'
    | 'warehouses'
    | 'isDeleted'
  > {
  attributes: null | Omit<IWarehouseProductAttribute, 'name'>[];
}

export interface INewWarehouseProduct extends Omit<IWarehouseProduct, '_id'> {}
