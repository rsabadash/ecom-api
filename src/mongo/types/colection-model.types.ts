import { Document } from 'bson';
import { AnyBulkWriteOperation, BulkWriteResult } from 'mongodb';

export type PipelineItem = Document;

export type Pipeline = PipelineItem[];

export type BulkOperations<Entity extends Document> =
  AnyBulkWriteOperation<Entity>;

export type BulkResult = BulkWriteResult;
