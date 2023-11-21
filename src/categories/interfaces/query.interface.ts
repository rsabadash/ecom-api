import { ObjectId } from 'mongodb';

export interface IQueryCategory {
    ids?: string;
    parentIds?: 'root';
}

export interface IQueryPipelineCategory {
    _id?: ObjectId | { $in: ObjectId[] };
    parentIdsHierarchy?: string | [];
}