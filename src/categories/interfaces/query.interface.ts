import { ObjectId } from 'mongodb';

export interface IQueryCategory {
    ids?: string;
    parentIds?: 'root';
}

type QueryPipelineCategoryItem =
    { _id?: ObjectId | { $in: ObjectId[] } } |
    { parentIdsHierarchy?: string | [] };

export interface IQueryPipelineCategory {
    $and: QueryPipelineCategoryItem[];
}