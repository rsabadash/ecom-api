import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { MongoModule } from '../mongo/mongo.module';
import { SUPPLIER_COLLECTION } from '../common/constants/collections.constants';
import { SuppliersService } from './suppliers.service';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { CompareFieldsService } from '../common/services/compare-fields.service';

@Module({
  imports: [
    MongoModule.forFeature(
      {
        collections: [SUPPLIER_COLLECTION],
      },
      CONNECTION_DB_NAME,
    ),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService, CompareFieldsService],
})
export class SuppliersModule {}
