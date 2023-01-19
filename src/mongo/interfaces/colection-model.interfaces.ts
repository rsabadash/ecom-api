import {
  AggregateOptions,
  Collection,
  Filter,
  OptionalId,
  UpdateFilter,
} from 'mongodb';
import {
  EntityWithId,
  FindEntityOptions,
  PartialEntity,
  PartialEntityRemoveFields,
  PartialEntityUpdate,
} from '../types/mongo-query.types';

export interface UpdateOneResult {
  isFound: boolean;
  isUpdated: boolean;
}

export interface DeleteOneResult {
  isDeleted: boolean;
}

export interface ICollectionModel<Entity> {
  readonly collection: Collection<Entity>;

  findOne(
    entityQuery?: PartialEntity<Entity>,
    options?: Omit<FindEntityOptions<Entity>, 'limit' | 'skip'>,
  ): Promise<EntityWithId<Entity> | null>;

  find(
    entityQuery?: PartialEntity<Entity>,
    options?: FindEntityOptions<Entity>,
  ): Promise<EntityWithId<Entity>[] | []>;

  updateOne(
    entityQuery: PartialEntity<Entity>,
    updateData: PartialEntityUpdate<Entity>,
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

  create(entity: OptionalId<Entity>): Promise<EntityWithId<Entity> | null>;

  deleteOne(entityQuery: PartialEntity<Entity>): Promise<DeleteOneResult>;

  aggregate<Result>(pipeline, options?: AggregateOptions): Promise<Result[]>;
}
