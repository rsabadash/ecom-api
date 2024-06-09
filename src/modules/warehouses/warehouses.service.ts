import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../../mongo/decorators/mongo.decorators';
import { WAREHOUSES_COLLECTION } from '../../common/constants/collections.constants';
import { ICollectionModel } from '../../mongo/interfaces/colection-model.interfaces';
import {
  WarehouseEntity,
  GetWarehouseParameters,
  CreateWarehouse,
  UpdateWarehouse,
  DeleteWarehouse,
} from './interface/warehouse.interface';
import { CompareFieldsService } from '../../common/services/compare-fields.service';
import { EntityNotFoundException } from '../../common/exeptions/entity-not-found.exception';
import { ERROR } from './constants/swagger.constants';
import {
  CreateWarehouseResponse,
  GetWarehouseResponse,
  GetWarehousesResponse,
  WarehouseDropdownListItem,
} from './interface/response.interface';

@Injectable()
export class WarehousesService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(WAREHOUSES_COLLECTION)
    private readonly warehousesCollection: ICollectionModel<WarehouseEntity>,
  ) {}

  async getWarehouses(): Promise<GetWarehousesResponse[]> {
    return this.warehousesCollection.find();
  }

  async getWarehousesDropdownList(): Promise<WarehouseDropdownListItem[]> {
    const warehouses = await this.getWarehouses();

    return warehouses.map((warehouse) => {
      return {
        id: warehouse._id.toString(),
        value: warehouse.name,
      };
    });
  }

  async getWarehouse(
    parameters: GetWarehouseParameters,
  ): Promise<GetWarehouseResponse> {
    const warehouse = await this.warehousesCollection.findOne({
      _id: new ObjectId(parameters.warehouseId),
    });

    if (!warehouse) {
      throw new EntityNotFoundException(ERROR.WAREHOUSE_NOT_FOUND);
    }

    return warehouse;
  }

  async createWarehouse(
    createWarehouse: CreateWarehouse,
  ): Promise<CreateWarehouseResponse> {
    const newWarehouse = await this.warehousesCollection.create(
      createWarehouse,
    );

    if (!newWarehouse) {
      throw new BadRequestException(ERROR.WAREHOUSE_NOT_CREATED);
    }

    return newWarehouse;
  }

  async updateWarehouse(updateWarehouse: UpdateWarehouse): Promise<void> {
    const warehouse = await this.getWarehouse({
      warehouseId: updateWarehouse.id,
    });

    const { _id, updatedFields } =
      this.compareFieldsService.compare<WarehouseEntity>(
        updateWarehouse,
        warehouse,
      );

    const updatedResult = await this.warehousesCollection.updateOne(
      { _id },
      updatedFields,
    );

    if (!updatedResult.isUpdated) {
      throw new BadRequestException(ERROR.WAREHOUSE_NOT_UPDATED);
    }
  }

  async deleteWarehouse(deleteWarehouse: DeleteWarehouse): Promise<void> {
    await this.warehousesCollection.deleteOne({
      _id: new ObjectId(deleteWarehouse.id),
    });
  }
}
