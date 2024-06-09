import { SupplyEntity } from './supplies.interfaces';
import { PaginationData } from '../../common/interfaces/pagination.interface';
import {
  ATTRIBUTE_IDS,
  VARIANT_IDS,
  WAREHOUSE_PRODUCT_ID,
} from '../../common/constants/cross-entity-id.constants';

export interface SupplyResponseEntity extends SupplyEntity {}

export interface GetSuppliesResponse
  extends PaginationData<SupplyResponseEntity> {}

export interface GetSupplyResponse extends SupplyResponseEntity {}

export interface CreateSupplyResponse extends SupplyResponseEntity {}

export interface SupplyProductResponse {
  [WAREHOUSE_PRODUCT_ID]: string;
  productName: string;
  quantity: string;
  price: string;
  totalCost: string;
  [ATTRIBUTE_IDS]: string[];
  [VARIANT_IDS]: string[];
}
