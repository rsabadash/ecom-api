import { Module } from '@nestjs/common';
import { MongoModule } from '../../mongo/mongo.module';
import { USERS_COLLECTION } from '../../common/constants/collections.constants';
import { CONNECTION_DB_NAME } from '../../common/constants/database.contants';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CompareFieldsService } from '../../common/services/compare-fields.service';

@Module({
  imports: [
    MongoModule.forFeature(
      {
        collections: [USERS_COLLECTION],
      },
      CONNECTION_DB_NAME,
    ),
  ],
  controllers: [UsersController],
  providers: [UsersService, CompareFieldsService],
  exports: [UsersService],
})
export class UsersModule {}
