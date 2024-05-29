import { PaginationData } from '../../common/interfaces/pagination.interface';
import { SupplierEntity } from './supplier.interface';
import { DropdownListItem } from '../../common/interfaces/dropdown-list.interface';

export interface SupplierEntityResponse extends SupplierEntity {}

export interface GetSuppliersResponse
  extends PaginationData<SupplierEntityResponse> {}

export interface SupplierDropdownListItem extends DropdownListItem {}

export interface GetSupplierResponse extends SupplierEntityResponse {}

export interface CreateSupplierResponse extends GetSupplierResponse {}
