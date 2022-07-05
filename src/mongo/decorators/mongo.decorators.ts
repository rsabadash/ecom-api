import { Inject } from '@nestjs/common';
import {
  getConnectionToken,
  getCollectionToken,
  getDbToken,
  getCollectionModelToken,
} from '../utils/mongo.util';

export const InjectConnection = (connectionName?: string) =>
  Inject(getConnectionToken(connectionName));

export const InjectDb = (connectionName?: string) =>
  Inject(getDbToken(connectionName));

export const InjectCollection = (collectionName: string) =>
  Inject(getCollectionToken(collectionName));

export const InjectCollectionModel = (collectionName: string) =>
  Inject(getCollectionModelToken(collectionName));
