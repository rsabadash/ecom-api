import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { CATEGORY_COLLECTION } from '../common/constants/collections.constants';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MongoModule.forFeature({
      collections: [CATEGORY_COLLECTION],
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
