import { ObjectId } from 'mongodb';
import { IWarehouseProductWarehouses } from '../../warehouseProducts/interfaces/warehouse-products.interfaces';
import { Translations } from '../../common/types/i18n.types';

export interface ISupply {
  _id: ObjectId;
  name: null | string;
  products: ISupplyProduct[];
  productsTotalCost: string;
  productsTotalQuantity: string;
  supplierId: string;
  warehouseId: string;
  createdAt: Date;
}

export interface ISupplyProduct {
  productId: string;
  productName: Translations;
  quantity: string;
  price: string;
  totalCost: string;
  attributeIds: null | string[];
  variantIds: null | string[];
}

export interface ProductsToCreateSupply
  extends Pick<
    ISupplyProduct,
    'productId' | 'quantity' | 'price' | 'totalCost'
  > {}

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
