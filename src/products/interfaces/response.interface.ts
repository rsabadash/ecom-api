import { ProductEntity } from './products.interfaces';
import { PaginationData } from '../../common/interfaces/pagination.interface';
import {
  ATTRIBUTE_ID,
  VARIANT_ID,
  WAREHOUSE_ID,
} from '../../common/constants/cross-entity-id.constants';
import { DropdownListItem } from '../../common/interfaces/dropdown-list.interface';
import { Unit } from '../enums/unit.enum';

export interface ProductEntityResponse extends ProductEntity {}

export interface GetProductsResponse
  extends PaginationData<ProductEntityResponse> {}

export interface CreateProductsResponse extends ProductEntityResponse {}

export interface ProductVariantResponse {
  [VARIANT_ID]: string;
  name: string;
}

export interface ProductAttributeResponse {
  [ATTRIBUTE_ID]: string;
  name: string;
  variants: ProductVariantResponse[];
}

export interface ProductWarehouseResponse {
  [WAREHOUSE_ID]: string;
  totalQuantity: string | null;
}

export interface ProductDropdownMeta {
  unit: Unit;
}

export interface ProductDropdownListItem
  extends DropdownListItem<ProductDropdownMeta> {}
