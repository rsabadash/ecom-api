import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongoModule } from '../mongo/mongo.module';
import databaseConfig from './config/database.config';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';

@Module({
  imports: [
    MongoModule.forRootAsync(
      {
        imports: [ConfigModule.forFeature(databaseConfig)],
        useFactory: (
          databaseConfiguration: ConfigType<typeof databaseConfig>,
        ) => {
          const { user, host, name, scheme, password, query } =
            databaseConfiguration;

          return {
            uri: `${scheme}${user}:${password}@${host}/?${query}`,
            dbName: name,
          };
        },
        inject: [databaseConfig.KEY],
      },
      CONNECTION_DB_NAME,
    ),
  ],
})
export class DatabaseModule {}
