import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { ATTRIBUTE_COLLECTION } from '../common/constants/collections.constants';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';

@Module({
  imports: [
    MongoModule.forFeature({
      collections: [ATTRIBUTE_COLLECTION],
    }),
  ],
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
