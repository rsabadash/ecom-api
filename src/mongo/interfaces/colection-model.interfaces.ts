import {
  AggregateOptions,
  BulkWriteOptions,
  Collection,
  Filter,
  InsertOneOptions,
  OptionalId,
  UpdateFilter,
} from 'mongodb';
import { Document } from 'bson';
import {
  EntityWithId,
  FindEntityOptions,
  PartialEntity,
  PartialEntityRemoveFields,
  PartialEntityUpdate,
} from '../types/mongo-query.types';
import {
  BulkOperations,
  BulkResult,
  Pipeline,
} from '../types/colection-model.types';

export interface UpdateOneResult {
  isFound: boolean;
  isUpdated: boolean;
}

export interface DeleteOneResult {
  isDeleted: boolean;
}

export interface ICollectionModel<Entity extends Document> {
  readonly collection: Collection<Entity>;

  findOne(
    entityQuery?: PartialEntity<Entity>,
    options?: Omit<FindEntityOptions<Entity>, 'limit' | 'skip'>,
  ): Promise<EntityWithId<Entity> | null>;

  find(
    entityQuery?: PartialEntity<Entity>,
    options?: FindEntityOptions<Entity>,
  ): Promise<EntityWithId<Entity>[]>;

  updateOne(
    entityQuery: PartialEntity<Entity>,
    updateData: PartialEntityUpdate<Entity>,
  ): Promise<UpdateOneResult>;

  updateWithOperator(
    entityQuery: PartialEntity<Entity>,
    options: UpdateFilter<Entity>,
  ): Promise<UpdateOneResult>;

  updateMany(filter: Filter<Entity>, update: UpdateFilter<Entity>);

  // updateOneArray(
  //   entityQuery: PartialEntity<Entity>,
  //   updateData: PartialEntityUpdateArray<Entity>,
  //   options: UpdateOneArrayOptions,
  // ): Promise<EntityWithId<Entity> | null>;

  removeField(
    entityQuery: PartialEntity<Entity>,
    fieldsToRemove: PartialEntityRemoveFields<Entity>,
  ): Promise<boolean>;

  renameField(
    entityQuery: PartialEntity<Entity>,
    fieldsToRename: Record<string, string>,
  ): Promise<boolean>;

  create(
    entity: OptionalId<Entity>,
    options?: InsertOneOptions,
  ): Promise<EntityWithId<Entity> | null>;

  createMany(
    entity: OptionalId<Entity>[],
  ): Promise<EntityWithId<Entity>[] | null>;

  deleteOne(entityQuery: PartialEntity<Entity>): Promise<DeleteOneResult>;

  aggregate<Result>(
    pipeline: Pipeline,
    options?: AggregateOptions,
  ): Promise<Result[]>;

  bulkWrite(
    operations: BulkOperations<Entity>[],
    options?: BulkWriteOptions,
  ): Promise<BulkResult>;
}
