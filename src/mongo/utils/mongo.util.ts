import { DEFAULT_MONGO_CONNECTION_NAME } from '../constants/mongo.constants';

export const getConnectionContainerToken = (
  connectionName: string = DEFAULT_MONGO_CONNECTION_NAME,
) => {
  return `${connectionName}Container`;
};

export const getConnectionToken = (
  connectionName: string = DEFAULT_MONGO_CONNECTION_NAME,
) => {
  return `${connectionName}Connection`;
};

export const getDbToken = (
  connectionName: string = DEFAULT_MONGO_CONNECTION_NAME,
) => {
  return `${connectionName}Db`;
};

export const getCollectionToken = (collectionName: string) => {
  return `${collectionName}Collection`;
};

export const getCollectionModelToken = (collectionName: string) => {
  return `${collectionName}CollectionModel`;
};
