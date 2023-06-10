import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { SUPPLIES_COLLECTION } from '../common/constants/collections.constants';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { SuppliesController } from './supplies.controller';
import { SuppliesService } from './supplies.service';
import { WarehouseProductsModule } from '../warehouseProducts/warehouse-products.module';
import { WarehousesModule } from '../warehouses/warehouses.module';

@Module({
  imports: [
    MongoModule.forFeature(
      {
        collections: [SUPPLIES_COLLECTION],
      },
      CONNECTION_DB_NAME,
    ),
    WarehouseProductsModule,
    WarehousesModule,
  ],
  controllers: [SuppliesController],
  providers: [SuppliesService],
})
export class SuppliesModule {}
