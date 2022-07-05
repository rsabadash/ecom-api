import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { PRODUCT_COLLECTION } from '../common/constants/collections.constants';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongoModule.forFeature({
      collections: [PRODUCT_COLLECTION],
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
