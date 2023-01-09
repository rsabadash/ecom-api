import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { AttributeModule } from './attribute/attribute.module';
import { getEnvPath } from './common/helper/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath }),
    DatabaseModule,
    ProductModule,
    CategoryModule,
    AttributeModule,
  ],
})
export class AppModule {}
