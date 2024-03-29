import { ObjectId } from 'mongodb';
import { IWarehouseProductWarehouses } from '../../warehouseProducts/interfaces/warehouse-products.interfaces';
import { Translations } from '../../common/types/i18n.types';
import {
  ATTRIBUTE_IDS,
  SUPPLIER_ID,
  VARIANT_IDS,
  WAREHOUSE_ID,
  WAREHOUSE_PRODUCT_ID,
} from '../../common/constants/cross-entity-id.constants';

export interface ISupply {
  _id: ObjectId;
  name: null | string;
  products: ISupplyProduct[];
  productsTotalCost: string;
  [SUPPLIER_ID]: string;
  [WAREHOUSE_ID]: string;
  createdAt: Date;
}

export interface ISupplyDto extends Omit<ISupply, '_id'> {
  _id: string;
}

export interface ISupplyProduct {
  [WAREHOUSE_PRODUCT_ID]: string;
  productName: Translations;
  quantity: string;
  price: string;
  totalCost: string;
  [ATTRIBUTE_IDS]: string[];
  [VARIANT_IDS]: string[];
}

export interface ISupplyProductToCreate
  extends Pick<
    ISupplyProduct,
    'productId' | 'quantity' | 'price' | 'totalCost'
  > {}

export interface ISupplyCreate
  extends Pick<
    ISupply,
    'name' | 'productsTotalCost' | 'supplierId' | 'warehouseId'
  > {
  products: ISupplyProductToCreate[];
}

export interface BulkUpdateFilter {
  updateOne: {
    filter: {
      _id: ObjectId;
    };
    update: {
      $set: {
        supplyIds: string[];
        warehouses: IWarehouseProductWarehouses[];
      };
    };
  };
}

export interface GetSupplyParameters {
  supplyId: string;
}
