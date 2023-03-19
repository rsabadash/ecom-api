import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { WAREHOUSES_COLLECTION } from '../common/constants/collections.constants';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';

@Module({
  imports: [
    MongoModule.forFeature(
      {
        collections: [WAREHOUSES_COLLECTION],
      },
      CONNECTION_DB_NAME,
    ),
  ],
  controllers: [WarehousesController],
  providers: [WarehousesService],
})
export class WarehousesModule {}
