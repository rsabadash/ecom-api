import { ObjectId } from 'mongodb';
import { IWarehouseProductWarehouses } from '../../warehouseProducts/interfaces/warehouse-products.interfaces';
import { Translations } from '../../common/types/i18n.types';

export interface ISupply {
  _id: ObjectId;
  name: null | string;
  products: ISupplyProduct[];
  productsTotalCost: string;
  supplierId: string;
  warehouseId: string;
  createdAt: Date;
}

export interface ISupplyDto extends Omit<ISupply, '_id'> {
  _id: string;
}

export interface ISupplyProduct {
  productId: string;
  productName: Translations;
  quantity: string;
  price: string;
  totalCost: string;
  attributeIds: string[];
  variantIds: string[];
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
