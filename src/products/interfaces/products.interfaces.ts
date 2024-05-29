import { ObjectId } from 'mongodb';
import { Unit } from '../enums/unit.enum';
import {
  ATTRIBUTE_ID,
  SUPPLY_IDS,
  VARIANT_ID,
  WAREHOUSE_ID,
} from '../../common/constants/cross-entity-id.constants';

export interface ProductEntity {
  _id: ObjectId;
  name: string;
  sku: string;
  unit: Unit;
  attributes: ProductAttribute[];
  createdAt: Date;
  [SUPPLY_IDS]: string[];
  warehouses: ProductWarehouses[];
  isDeleted: boolean;
}

export interface ProductVariant {
  [VARIANT_ID]: string;
  name: string;
}

export interface CreateProductVariant extends ProductVariant {}

export interface CreateProductAttribute {
  [ATTRIBUTE_ID]: string;
  variants: CreateProductVariant[];
}

export interface ProductAttribute {
  [ATTRIBUTE_ID]: string;
  name: string;
  variants: ProductVariant[];
}

export interface ProductWarehouses {
  [WAREHOUSE_ID]: string;
  totalQuantity: string | null;
}

export interface CreateProduct {
  name: string;
  sku: string;
  unit: Unit;
  attributes: CreateProductAttribute[] | null;
}

export interface NewProduct extends Omit<ProductEntity, '_id'> {}
