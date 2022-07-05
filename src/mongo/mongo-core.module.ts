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
  getConnectionContainerToken,
  getDbToken,
} from './utils/mongo.util';
import {
  MongoModuleOptions,
  MongoModuleAsyncOptions,
  MongoOptionsFactory,
} from './interfaces/mongo.interfaces';

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

    const connectionContainerProvider = {
      provide: getConnectionContainerToken(connectionName),
      useFactory: () => new Map<string, MongoClient>(),
    };

    const connectionProvider = {
      provide: getConnectionToken(connectionName),
      useFactory: async (connections: Map<string, MongoClient>) => {
        if (connections.has(connectionName)) {
          return connections.get(connectionName);
        }

        const { uri, connectionOptions } = options;

        const client = new MongoClient(uri, connectionOptions);
        connections.set(connectionName, client);

        return await client.connect();
      },
      inject: [getConnectionContainerToken(connectionName)],
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
        connectionContainerProvider,
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

    const connectionContainerProvider = {
      provide: getConnectionContainerToken(connectionName),
      useFactory: () => new Map<string, MongoClient>(),
    };

    const connectionProvider = {
      provide: getConnectionToken(connectionName),
      useFactory: async (
        connections: Map<string, MongoClient>,
        mongoModuleOptions: MongoModuleOptions,
      ) => {
        if (connections.has(connectionName)) {
          return connections.get(connectionName);
        }

        const { uri, connectionOptions } = mongoModuleOptions;

        const client = new MongoClient(uri, connectionOptions);
        connections.set(connectionName, client);

        return await client.connect();
      },
      inject: [
        getConnectionContainerToken(connectionName),
        MONGO_MODULE_OPTIONS,
      ],
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
        connectionContainerProvider,
      ],
      exports: [connectionProvider, dbProvider],
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
    const clientsMap: Map<string, MongoClient> = this.moduleRef.get<
      Map<string, MongoClient>
    >(getConnectionContainerToken(this.containerName));

    if (clientsMap) {
      await Promise.all(
        [...clientsMap.values()].map((connection) => connection.close()),
      );
    }
  }
}
