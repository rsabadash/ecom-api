import { Inject } from '@nestjs/common';
import {
  getConnectionToken,
  getCollectionToken,
  getDbToken,
  getCollectionModelToken,
  getClientToken,
} from '../utils/mongo.utils';

export const InjectClients = (connectionName?: string) =>
  Inject(getClientToken(connectionName));

export const InjectConnection = (connectionName?: string) =>
  Inject(getConnectionToken(connectionName));

export const InjectDb = (connectionName?: string) =>
  Inject(getDbToken(connectionName));

export const InjectCollection = (collectionName: string) =>
  Inject(getCollectionToken(collectionName));

export const InjectCollectionModel = (collectionName: string) =>
  Inject(getCollectionModelToken(collectionName));
