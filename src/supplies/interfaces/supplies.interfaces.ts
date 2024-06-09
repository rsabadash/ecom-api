import { ObjectId } from 'mongodb';
import { ProductWarehouses } from '../../products/interfaces/product.interfaces';
import {
  ATTRIBUTE_IDS,
  SUPPLIER_ID,
  VARIANT_IDS,
  WAREHOUSE_ID,
  WAREHOUSE_PRODUCT_ID,
} from '../../common/constants/cross-entity-id.constants';

export interface SupplyEntity {
  _id: ObjectId;
  name: null | string;
  products: ISupplyProduct[];
  productsTotalCost: string;
  [SUPPLIER_ID]: string;
  [WAREHOUSE_ID]: string;
  createdAt: Date;
}

export interface ISupplyProduct {
  [WAREHOUSE_PRODUCT_ID]: string;
  productName: string;
  quantity: string;
  price: string;
  totalCost: string;
  [ATTRIBUTE_IDS]: string[];
  [VARIANT_IDS]: string[];
}

export interface CreateSupplyProduct {
  productId: string;
  quantity: string;
  price: string;
  totalCost: string;
}

export interface CreateSupply {
  name: string | null;
  productsTotalCost: string;
  [SUPPLIER_ID]: string;
  [WAREHOUSE_ID]: string;
  products: CreateSupplyProduct[];
}

export interface BulkUpdateFilter {
  updateOne: {
    filter: {
      _id: ObjectId;
    };
    update: {
      $set: {
        supplyIds: string[];
        warehouses: ProductWarehouses[];
      };
    };
  };
}

export interface GetSupplyParameters {
  supplyId: string;
}
