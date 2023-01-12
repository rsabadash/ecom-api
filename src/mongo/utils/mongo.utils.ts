import { DEFAULT_MONGO_CONNECTION_NAME } from '../constants/mongo.constants';

export const getClientToken = (
  connectionName: string = DEFAULT_MONGO_CONNECTION_NAME,
): string => {
  return `${connectionName}Client`;
};

export const getConnectionToken = (
  connectionName: string = DEFAULT_MONGO_CONNECTION_NAME,
): string => {
  return `${connectionName}Connection`;
};

export const getDbToken = (
  connectionName: string = DEFAULT_MONGO_CONNECTION_NAME,
): string => {
  return `${connectionName}Db`;
};

export const getCollectionToken = (collectionName: string): string => {
  return `${collectionName}Collection`;
};

export const getCollectionModelToken = (collectionName: string): string => {
  return `${collectionName}CollectionModel`;
};
