import { ModuleMetadata, Type } from '@nestjs/common';
import { Collection, MongoClientOptions, UpdateResult } from 'mongodb';
import {
  EntityWithId,
  FindEntityOptions,
  NewEntity,
  PartialEntity,
  PartialEntityUpdate,
  PartialEntityRemoveFields,
  // PartialEntityUpdateArray,
  // UpdateOneArrayOptions,
} from '../types/mongo-query.types';

export interface MongoModuleOptions {
  uri: string;
  dbName: string;
  connectionOptions?: MongoClientOptions;
}

export interface MongoOptionsFactory {
  createMongoOptions(): Promise<MongoModuleOptions> | MongoModuleOptions;
}

export interface MongoModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<MongoOptionsFactory>;
  useClass?: Type<MongoOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MongoModuleOptions> | MongoModuleOptions;
  inject?: any[];
}

export interface MongoModuleFeatureOptions {
  collections: string[];
  rawCollection?: boolean;
}

export interface CollectionModelConstructor<Entity> {
  new (collection: Collection<Entity>): ICollectionModel<Entity>;
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
  ): Promise<UpdateResult>;

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

  create(entity: NewEntity<Entity>): Promise<EntityWithId<Entity> | null>;

  deleteOne(
    entityQuery: PartialEntity<Entity>,
  ): Promise<EntityWithId<Entity> | null>;
}
