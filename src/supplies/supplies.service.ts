import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { SUPPLIES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { ISupply } from './interfaces/supplies.interfaces';
import { WarehouseProductsService } from '../warehouseProducts/warehouse-products.service';
import { Unit } from '../warehouseProducts/enums/unit.enums';
import { ObjectId } from 'mongodb';
import { WarehousesService } from '../warehouses/warehouses.service';

function sliceIntoChunks(arr, chunkSize) {
  const res = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }

  return res;
}

interface TestP {
  quantity: string;
  price: string;
  totalCost: string;
  nameId: string;
  unit: Unit;
}

interface Test {
  productsTotalQuantity: string;
  productsTotalCost: string;
  name: string;
  products: TestP[];
  supplierId: string;
  warehouseId: string;
}

@Injectable()
export class SuppliesService {
  constructor(
    @InjectCollectionModel(SUPPLIES_COLLECTION)
    private readonly supplyCollection: ICollectionModel<ISupply>,
    private readonly warehouseProductsService: WarehouseProductsService,
    private readonly warehousesService: WarehousesService,
  ) {}

  async createSupply(createSupplyDto: Test): Promise<any> {
    console.log('createSupplyDto', createSupplyDto);
  }
}
