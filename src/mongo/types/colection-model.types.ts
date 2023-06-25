import { Document } from 'bson';
import { AnyBulkWriteOperation, BulkWriteResult } from 'mongodb';

export type Pipeline = Document[];

export type BulkOperations<Entity extends Document> =
  AnyBulkWriteOperation<Entity>;

export type BulkResult = BulkWriteResult;
