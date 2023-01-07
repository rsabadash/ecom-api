import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { MongoModule } from '../mongo/mongo.module';
import { SUPPLIER_COLLECTION } from '../common/constants/collections.constants';
import { SuppliersService } from './suppliers.service';

@Module({
  imports: [
    MongoModule.forFeature({
      collections: [SUPPLIER_COLLECTION],
    }),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
