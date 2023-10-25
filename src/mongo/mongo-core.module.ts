import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { MongoClient } from 'mongodb';
import {
  DEFAULT_MONGO_CONNECTION_NAME,
  MONGO_CONTAINER_NAME,
  MONGO_MODULE_OPTIONS,
} from './constants/mongo.constants';
import {
  getConnectionToken,
  getClientToken,
  getDbToken,
} from './utils/mongo.utils';
import {
  MongoModuleOptions,
  MongoModuleAsyncOptions,
  MongoOptionsFactory,
} from './interfaces/mongo-module.interfaces';
import {
  ClientMapKey,
  ClientMapValue,
  ClientsMap,
} from './types/mongo-query.types';

@Global()
@Module({})
export class MongoCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(MONGO_CONTAINER_NAME)
    private readonly containerName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(
    options: MongoModuleOptions,
    connectionName: string = DEFAULT_MONGO_CONNECTION_NAME,
  ): DynamicModule {
    const containerNameProvider = {
      provide: MONGO_CONTAINER_NAME,
      useValue: connectionName,
    };

    const clientProvider = {
      provide: getClientToken(connectionName),
      useFactory: () => new Map<ClientMapKey, ClientMapValue>(),
    };

    const connectionProvider = {
      provide: getConnectionToken(connectionName),
      useFactory: async (clients: ClientsMap) => {
        if (clients.has(connectionName)) {
          return clients.get(connectionName);
        }
        const { uri, connectionOptions } = options;

        const client = new MongoClient(uri, connectionOptions);
        clients.set(connectionName, client);

        return client.connect();
      },
      inject: [getClientToken(connectionName)],
    };

    const dbProvider = {
      provide: getDbToken(connectionName),
      useFactory: (client: MongoClient) => client.db(options.dbName),
      inject: [getConnectionToken(connectionName)],
    };

    return {
      module: MongoCoreModule,
      providers: [
        containerNameProvider,
        clientProvider,
        connectionProvider,
        dbProvider,
      ],
      exports: [connectionProvider, dbProvider],
    };
  }

  static forRootAsync(
    options: MongoModuleAsyncOptions,
    connectionName: string = DEFAULT_MONGO_CONNECTION_NAME,
  ): DynamicModule {
    const containerNameProvider = {
      provide: MONGO_CONTAINER_NAME,
      useValue: connectionName,
    };

    const clientProvider = {
      provide: getClientToken(connectionName),
      useFactory: () => new Map<ClientMapKey, ClientMapValue>(),
    };

    const connectionProvider = {
      provide: getConnectionToken(connectionName),
      useFactory: async (
        clients: ClientsMap,
        mongoModuleOptions: MongoModuleOptions,
      ) => {
        if (clients.has(connectionName)) {
          return clients.get(connectionName);
        }

        const { uri, connectionOptions } = mongoModuleOptions;

        const client = new MongoClient(uri, connectionOptions);
        clients.set(connectionName, client);

        return client.connect();
      },
      inject: [getClientToken(connectionName), MONGO_MODULE_OPTIONS],
    };

    const dbProvider = {
      provide: getDbToken(connectionName),
      useFactory: (
        client: MongoClient,
        mongoModuleOptions: MongoModuleOptions,
      ) => client.db(mongoModuleOptions.dbName),
      inject: [getConnectionToken(connectionName), MONGO_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: MongoCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        connectionProvider,
        dbProvider,
        containerNameProvider,
        clientProvider,
      ],
      exports: [clientProvider, connectionProvider, dbProvider],
    };
  }

  private static createAsyncProviders(
    options: MongoModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    if (options.useClass) {
      return [
        this.createAsyncOptionsProvider(options),
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }

    return [];
  }

  private static createAsyncOptionsProvider(
    options: MongoModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MONGO_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    if (options.useExisting) {
      return {
        provide: MONGO_MODULE_OPTIONS,
        useFactory: async (optionsFactory: MongoOptionsFactory) => {
          return optionsFactory.createMongoOptions();
        },
        inject: [options.useExisting],
      };
    }

    if (options.useClass) {
      return {
        provide: MONGO_MODULE_OPTIONS,
        useFactory: async (optionsFactory: MongoOptionsFactory) => {
          return optionsFactory.createMongoOptions();
        },
        inject: [options.useClass],
      };
    }

    throw new Error('Invalid async MongoModule options.');
  }

  async onModuleDestroy(): Promise<void> {
    const clientsMap: ClientsMap = this.moduleRef.get<ClientsMap>(
      getClientToken(this.containerName),
    );

    if (clientsMap) {
      await Promise.all(
        [...clientsMap.values()].map((connection) => connection.close()),
      );
    }
  }
}
