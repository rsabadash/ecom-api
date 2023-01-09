import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongoModule } from '../mongo/mongo.module';
import databaseConfig from '../common/config/database.config';

@Module({
  imports: [
    MongoModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory: (
        databaseConfiguration: ConfigType<typeof databaseConfig>,
      ) => {
        const { user, host, name, scheme, password, query } =
          databaseConfiguration;

        return {
          uri: `${scheme}${user}:${password}@${host}/${query}`,
          dbName: name,
        };
      },
      inject: [databaseConfig.KEY],
    }),
  ],
})
export class DatabaseModule {}
