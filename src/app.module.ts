import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { SuppliesModule } from './modules/supplies/supplies.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AttributesModule } from './modules/attributes/attributes.module';
import { UsersModule } from './modules/users/users.module';
import { IamModule } from './modules/iam/iam.module';
import { ProductsModule } from './modules/products/products.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { getEnvPath } from './common/utils/env.utils';

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
    SuppliesModule,
    ProductsModule,
    WarehousesModule,
  ],
})
export class AppModule {}
