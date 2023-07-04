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
} from './interfaces/warehouses.interfaces';
import { PartialEntity } from '../mongo/types/mongo-query.types';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { DeleteWarehouseDto } from './dto/delete-warehouse.dto';
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
    return await this.warehousesCollection.find(query);
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

  async updateWarehouse(updateWarehouseDto: IWarehouseUpdate): Promise<void> {
    const warehouse = await this.getWarehouse({
      warehouseId: updateWarehouseDto.id,
    });

    const { _id, updatedFields } =
      this.compareFieldsService.compare<IWarehouse>(
        updateWarehouseDto,
        warehouse,
      );

    const updatedResult = await this.warehousesCollection.updateOne(
      { _id },
      updatedFields,
    );

    if (!updatedResult.isUpdated) {
      throw new BadRequestException('The warehouse has not been updated');
    }
  }

  async deleteWarehouse(deleteWarehouseDto: DeleteWarehouseDto): Promise<void> {
    await this.warehousesCollection.deleteOne({
      _id: new ObjectId(deleteWarehouseDto.id),
    });
  }
}
