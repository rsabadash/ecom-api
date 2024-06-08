import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { AttributesController } from './attributes.controller';
import { VariantsController } from './variants.controller';
import { AttributesService } from './attributes.service';
import { VariantsService } from './variants.service';
import { ATTRIBUTES_COLLECTION } from '../common/constants/collections.constants';

@Module({
  imports: [
    MongoModule.forFeature(
      {
        collections: [ATTRIBUTES_COLLECTION],
      },
      CONNECTION_DB_NAME,
    ),
  ],
  controllers: [AttributesController, VariantsController],
  providers: [AttributesService, VariantsService, CompareFieldsService],
  exports: [AttributesService],
})
export class AttributesModule {}
