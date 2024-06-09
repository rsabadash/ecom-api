import { PaginationParsedQuery } from '../../../common/types/query.types';
import { ParentIds } from '../enums/parent-ids.enum';
import { ObjectId } from 'mongodb';

export interface GetCategoriesParameters {
  ids?: string;
  parentIds?: ParentIds.Root;
}

export interface GetCategoriesQuery
  extends PaginationParsedQuery<GetCategoriesParameters> {}

type QueryPipelineCategoryItem =
  | { _id?: ObjectId | { $in: ObjectId[] } }
  | { parentIdsHierarchy?: string | [] };

export interface IQueryPipelineCategory {
  $and: QueryPipelineCategoryItem[];
}

export interface GetCategoryParameters {
  categoryId: string;
}
