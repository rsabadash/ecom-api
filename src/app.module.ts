import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CategoriesModule } from './categories/categories.module';
import { AttributesModule } from './attributes/attributes.module';
import { IamModule } from './iam/iam.module';
import { getEnvPath } from './common/utils/env.utils';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath }),
    DatabaseModule,
    IamModule,
    CategoriesModule,
    AttributesModule,
    SuppliersModule,
  ],
})
export class AppModule {}
