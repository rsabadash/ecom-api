import {
  Filter,
  FindOptions,
  MatchKeysAndValues,
  MongoClient,
  OnlyFieldsOfType,
  WithId,
} from 'mongodb';

export type EntityWithId<Entity> = WithId<Entity>;

export type PartialEntity<Entity> = Filter<Entity>;

export type PartialEntityUpdate<Entity> = MatchKeysAndValues<Entity>;

export type PartialEntityRemoveFields<Entity> = OnlyFieldsOfType<Entity>;

export type FindEntityOptions<Entity> = FindOptions<Entity>;

export type ClientMapKey = string;

export type ClientMapValue = MongoClient;

export type ClientsMap = Map<ClientMapKey, ClientMapValue>;
