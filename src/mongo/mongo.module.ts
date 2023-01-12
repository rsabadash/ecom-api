import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Db, Collection } from 'mongodb';
import {
  MongoModuleOptions,
  MongoModuleAsyncOptions,
  MongoModuleFeatureOptions,
} from './interfaces/mongo-module.interfaces';
import { MongoCoreModule } from './mongo-core.module';
import {
  getCollectionModelToken,
  getCollectionToken,
  getDbToken,
} from './utils/mongo.utils';
import { CollectionModel } from './classes/collection-model.class';

@Module({})
export class MongoModule {
  static forRoot(
    options: MongoModuleOptions,
    connectionName?: string,
  ): DynamicModule {
    return {
      module: MongoModule,
      imports: [MongoCoreModule.forRoot(options, connectionName)],
    };
  }

  static forRootAsync(
    options: MongoModuleAsyncOptions,
    connectionName?: string,
  ): DynamicModule {
    return {
      module: MongoModule,
      imports: [MongoCoreModule.forRootAsync(options, connectionName)],
    };
  }

  static forFeature = (
    options: MongoModuleFeatureOptions,
    connectionName?: string,
  ): DynamicModule => {
    const { collections, rawCollection } = options;
    let collectionModelProviders: Provider[] = [];

    const collectionProviders = collections.map((collectionName) => ({
      provide: getCollectionToken(collectionName),
      useFactory: (db: Db) => db.collection(collectionName),
      inject: [getDbToken(connectionName)],
    }));

    if (!rawCollection) {
      collectionModelProviders = collections.map((collectionName) => ({
        provide: getCollectionModelToken(collectionName),
        useFactory: (collection: Collection) => new CollectionModel(collection),
        inject: [getCollectionToken(collectionName)],
      }));
    }

    const providers: Provider[] = [
      ...collectionProviders,
      ...collectionModelProviders,
    ];

    return {
      module: MongoModule,
      providers: providers,
      exports: providers,
    };
  };
}
