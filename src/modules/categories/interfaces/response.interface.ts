import { PaginationData } from '../../../common/interfaces/pagination.interface';
import { CategoryEntity } from './category.interface';
import { DropdownListItem } from '../../../common/interfaces/dropdown-list.interface';

export interface CategoryEntityResponse extends CategoryEntity {}

export interface GetCategoriesResponse
  extends PaginationData<CategoryEntityResponse> {}

export interface GetCategoryResponse
  extends Omit<CategoryEntityResponse, 'parentIdsHierarchy'> {
  parents: CategoryEntityResponse[];
}

export interface CreateCategoryResponse extends GetCategoryResponse {}

export interface CategoryDropdownListItem extends DropdownListItem {}
