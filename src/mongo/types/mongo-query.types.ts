import {
  Filter,
  FindOptions,
  MatchKeysAndValues,
  MongoClient,
  OnlyFieldsOfType,
  WithId,
} from 'mongodb';
import { Document } from 'bson';

export type EntityWithId<Entity> = WithId<Entity>;

export type PartialEntity<Entity> = Filter<Entity>;

export type PartialEntityUpdate<Entity> = MatchKeysAndValues<Entity>;

export type PartialEntityRemoveFields<Entity> = OnlyFieldsOfType<Entity>;

export type FindEntityOptions<Entity extends Document> = FindOptions<Entity>;

export type ClientMapKey = string;

export type ClientMapValue = MongoClient;

export type ClientsMap = Map<ClientMapKey, ClientMapValue>;
