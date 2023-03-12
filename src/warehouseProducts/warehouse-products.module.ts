import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { WAREHOUSE_PRODUCTS_COLLECTION } from '../common/constants/collections.constants';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { WarehouseProductsController } from './warehouse-products.controller';
import { WarehouseProductsService } from './warehouse-products.service';
import { AttributesModule } from '../attributes/attributes.module';

@Module({
  imports: [
    MongoModule.forFeature(
      {
        collections: [WAREHOUSE_PRODUCTS_COLLECTION],
      },
      CONNECTION_DB_NAME,
    ),
    AttributesModule,
  ],
  controllers: [WarehouseProductsController],
  providers: [WarehouseProductsService],
})
export class WarehouseProductsModule {}
