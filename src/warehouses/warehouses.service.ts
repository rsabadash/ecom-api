import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { WAREHOUSES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { IWarehouse } from './interfaces/warehouses.interfaces';
import { PartialEntity } from '../mongo/types/mongo-query.types';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { GetWarehouseParameters } from './types/warehouses.types';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectCollectionModel(WAREHOUSES_COLLECTION)
    private readonly warehousesCollection: ICollectionModel<IWarehouse>,
  ) {}

  async getWarehouses(
    query: PartialEntity<IWarehouse> = {},
  ): Promise<IWarehouse[]> {
    return await this.warehousesCollection.find(query);
  }

  async getWarehouse(parameters: GetWarehouseParameters): Promise<IWarehouse> {
    const warehouse = await this.warehousesCollection.findOne({
      _id: new ObjectId(parameters.warehouseId),
    });

    if (!warehouse) {
      throw new NotFoundException('The warehouse has not been found');
    }

    return warehouse;
  }

  async createWarehouse(
    createWarehouse: CreateWarehouseDto,
  ): Promise<IWarehouse> {
    const newWarehouse = await this.warehousesCollection.create(
      createWarehouse,
    );

    if (!newWarehouse) {
      throw new BadRequestException('The warehouse has not been created');
    }

    return newWarehouse;
  }
}
