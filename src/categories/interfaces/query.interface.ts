import { PaginationParsedQuery } from '../../common/types/query.types';
import { ParentIds } from '../enums/parent-ids.enum';
import { ObjectId } from 'mongodb';

export interface GetCategoriseParameters {
  ids?: string;
  parentIds?: ParentIds.Root;
}

export interface GetCategoriseQuery
  extends PaginationParsedQuery<GetCategoriseParameters> {}

type QueryPipelineCategoryItem =
  | { _id?: ObjectId | { $in: ObjectId[] } }
  | { parentIdsHierarchy?: string | [] };

export interface IQueryPipelineCategory {
  $and: QueryPipelineCategoryItem[];
}
