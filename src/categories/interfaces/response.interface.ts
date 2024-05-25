import { PaginationData } from '../../common/interfaces/pagination.interface';
import { CategoryEntity } from './category.interface';

export interface CategoryEntityResponse extends Omit<CategoryEntity, '_id'> {
  _id: string;
}

export interface GetCategoriesResponse
  extends PaginationData<CategoryEntityResponse> {}

export interface GetCategoryResponse
  extends Omit<CategoryEntityResponse, 'parentIdsHierarchy'> {
  parents: CategoryEntityResponse[];
}

export interface CreateCategoryResponse extends GetCategoryResponse {}
