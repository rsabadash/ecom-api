import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { WAREHOUSES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  IWarehouse,
  GetWarehouseParameters,
  IWarehouseCreate,
  IWarehouseUpdate,
  IWarehouseDelete,
} from './interfaces/warehouses.interfaces';
import { PartialEntity } from '../mongo/types/mongo-query.types';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { EntityNotFoundException } from '../common/exeptions/entity-not-found.exception';
import { DropdownListItem } from '../common/interfaces/dropdown-list.interface';
import { ERROR } from './constants/message.constants';

@Injectable()
export class WarehousesService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(WAREHOUSES_COLLECTION)
    private readonly warehousesCollection: ICollectionModel<IWarehouse>,
  ) {}

  async getWarehouses(
    query: PartialEntity<IWarehouse> = {},
  ): Promise<IWarehouse[]> {
    return this.warehousesCollection.find(query);
  }

  async getWarehousesDropdownList(): Promise<DropdownListItem[]> {
    const warehouses = await this.getWarehouses();

    return warehouses.map((warehouse) => {
      return {
        id: warehouse._id.toString(),
        value: warehouse.name,
      };
    });
  }

  async getWarehouse(parameters: GetWarehouseParameters): Promise<IWarehouse> {
    const warehouse = await this.warehousesCollection.findOne({
      _id: new ObjectId(parameters.warehouseId),
    });

    if (!warehouse) {
      throw new EntityNotFoundException(ERROR.WAREHOUSE_NOT_FOUND);
    }

    return warehouse;
  }

  async createWarehouse(
    createWarehouse: IWarehouseCreate,
  ): Promise<IWarehouse> {
    const newWarehouse = await this.warehousesCollection.create(
      createWarehouse,
    );

    if (!newWarehouse) {
      throw new BadRequestException(ERROR.WAREHOUSE_NOT_CREATED);
    }

    return newWarehouse;
  }

  async updateWarehouse(updateWarehouse: IWarehouseUpdate): Promise<void> {
    const warehouse = await this.getWarehouse({
      warehouseId: updateWarehouse.id,
    });

    const { _id, updatedFields } =
      this.compareFieldsService.compare<IWarehouse>(updateWarehouse, warehouse);

    const updatedResult = await this.warehousesCollection.updateOne(
      { _id },
      updatedFields,
    );

    if (!updatedResult.isUpdated) {
      throw new BadRequestException(ERROR.WAREHOUSE_NOT_UPDATED);
    }
  }

  async deleteWarehouse(deleteWarehouse: IWarehouseDelete): Promise<void> {
    await this.warehousesCollection.deleteOne({
      _id: new ObjectId(deleteWarehouse.id),
    });
  }
}
