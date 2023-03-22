import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { WAREHOUSES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { IWarehouse } from './interfaces/warehouses.interfaces';
import { PartialEntity } from '../mongo/types/mongo-query.types';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { GetWarehouseParameters } from './types/warehouses.types';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { DeleteWarehouseDto } from './dto/delete-warehouse.dto';
import { EntityNotFoundException } from '../common/exeptions/EntityNotFoundException';

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

  async getWarehouse(parameters: GetWarehouseParameters): Promise<IWarehouse> {
    const warehouse = await this.warehousesCollection.findOne({
      _id: new ObjectId(parameters.warehouseId),
    });

    if (!warehouse) {
      throw new EntityNotFoundException('The warehouse has not been found');
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

  async updateWarehouse(updateWarehouseDto: UpdateWarehouseDto): Promise<void> {
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
