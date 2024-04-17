import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { PRODUCTS_COLLECTION } from '../common/constants/collections.constants';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AttributesModule } from '../attributes/attributes.module';

@Module({
  imports: [
    MongoModule.forFeature(
      {
        collections: [PRODUCTS_COLLECTION],
      },
      CONNECTION_DB_NAME,
    ),
    AttributesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
