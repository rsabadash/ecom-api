import { ModuleMetadata, Type } from '@nestjs/common';
import { MongoClientOptions } from 'mongodb';

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
