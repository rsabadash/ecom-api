import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoModule } from '../mongo/mongo.module';

@Module({
  imports: [
    MongoModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: `${configService.get<string>('DATABASE_CONNECTION_SCHEME')}${configService.get<string>('DATABASE_HOST')}:${configService.get<string>('DATABASE_PORT')}`,
          //uri: `${configService.get<string>('DATABASE_CONNECTION_SCHEME')}${configService.get<string>('DATABASE_USER')}:${configService.get<string>('DATABASE_PASSWORD')}@${configService.get<string>('DATABASE_HOST')}`,
          dbName: configService.get<string>('DATABASE_NAME'),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
