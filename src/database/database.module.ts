import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongoModule } from '../mongo/mongo.module';
import databaseConfig from '../common/config/database.config';

@Module({
  imports: [
    MongoModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory: (dbConfiguration: ConfigType<typeof databaseConfig>) => ({
        uri: `mongodb+srv://${dbConfiguration.user}:${dbConfiguration.password}@${dbConfiguration.host}`,
        dbName: dbConfiguration.name,
      }),
      inject: [databaseConfig.KEY],
    }),
  ],
})
export class DatabaseModule {}
