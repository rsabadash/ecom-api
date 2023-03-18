import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CategoriesModule } from './categories/categories.module';
import { AttributesModule } from './attributes/attributes.module';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { getEnvPath } from './common/utils/env.utils';
import { WarehouseProductsModule } from './warehouseProducts/warehouse-products.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath }),
    DatabaseModule,
    UsersModule,
    IamModule,
    CategoriesModule,
    AttributesModule,
    SuppliersModule,
    WarehouseProductsModule,
  ],
})
export class AppModule {}
