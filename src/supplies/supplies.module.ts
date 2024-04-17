import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { SUPPLIES_COLLECTION } from '../common/constants/collections.constants';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { SuppliesController } from './supplies.controller';
import { SuppliesService } from './supplies.service';
import { ProductsModule } from '../products/products.module';
import { WarehousesModule } from '../warehouses/warehouses.module';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { MathService } from '../common/services/math.service';

@Module({
  imports: [
    MongoModule.forFeature(
      {
        collections: [SUPPLIES_COLLECTION],
      },
      CONNECTION_DB_NAME,
    ),
    ProductsModule,
    WarehousesModule,
    SuppliersModule,
  ],
  controllers: [SuppliesController],
  providers: [SuppliesService, MathService],
})
export class SuppliesModule {}
