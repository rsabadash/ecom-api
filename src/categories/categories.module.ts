import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { CATEGORIES_COLLECTION } from '../common/constants/collections.constants';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { CompareFieldsService } from '../common/services/compare-fields.service';

@Module({
  imports: [
    MongoModule.forFeature(
      {
        collections: [CATEGORIES_COLLECTION],
      },
      CONNECTION_DB_NAME,
    ),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CompareFieldsService],
})
export class CategoriesModule {}
