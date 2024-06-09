import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { SUPPLIERS_COLLECTION } from '../common/constants/collections.constants';
import {
  CreateSupplier,
  DeleteSupplier,
  GetSupplierParameters,
  SupplierEntity,
  UpdateSupplier,
} from './interfaces/supplier.interface';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { EntityNotFoundException } from '../common/exeptions/entity-not-found.exception';
import { ERROR } from './constants/swagger.constants';
import { getPaginationPipeline } from '../common/utils/getPaginationPipeline';
import { FindEntityOptions } from '../mongo/types/mongo-query.types';
import {
  CreateSupplierResponse,
  GetSupplierResponse,
  GetSuppliersResponse,
  SupplierDropdownListItem,
} from './interfaces/response.interface';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(SUPPLIERS_COLLECTION)
    private readonly supplierCollection: ICollectionModel<SupplierEntity>,
  ) {}

  async getSuppliers(
    query: Record<string, string> = {},
    options: FindEntityOptions<SupplierEntity> = {},
  ): Promise<GetSuppliersResponse> {
    const { skip, limit } = options;

    const pipeline = getPaginationPipeline({
      query,
      filter: {
        skip,
        limit,
      },
    });

    const paginatedData =
      await this.supplierCollection.aggregate<GetSuppliersResponse>(pipeline);

    return paginatedData[0];
  }

  async getSuppliersDropdownList(): Promise<SupplierDropdownListItem[]> {
    const suppliers = await this.supplierCollection.find();

    return suppliers.map((supplier) => {
      return {
        id: supplier._id.toString(),
        value: supplier.name,
      };
    });
  }

  async getSupplier(
    parameters: GetSupplierParameters,
  ): Promise<GetSupplierResponse> {
    const supplier = await this.supplierCollection.findOne({
      _id: new ObjectId(parameters.supplierId),
    });

    if (!supplier) {
      throw new EntityNotFoundException(ERROR.SUPPLIER_NOT_FOUND);
    }

    return supplier;
  }

  async createSupplier(
    createSupplier: CreateSupplier,
  ): Promise<CreateSupplierResponse> {
    const newSupplier = await this.supplierCollection.create(createSupplier);

    if (!newSupplier) {
      throw new BadRequestException(ERROR.SUPPLIER_NOT_CREATED);
    }

    return newSupplier;
  }

  async updateSupplier(updateSupplier: UpdateSupplier): Promise<void> {
    const supplier = await this.getSupplier({
      supplierId: updateSupplier.id,
    });

    const { _id, updatedFields } =
      this.compareFieldsService.compare<SupplierEntity>(
        updateSupplier,
        supplier,
      );

    const updateResult = await this.supplierCollection.updateOne(
      { _id },
      updatedFields,
    );

    if (!updateResult.isUpdated) {
      throw new GoneException(ERROR.SUPPLIER_NOT_UPDATED);
    }
  }

  async deleteSupplier(deleteSupplier: DeleteSupplier): Promise<void> {
    await this.supplierCollection.deleteOne({
      _id: new ObjectId(deleteSupplier.id),
    });
  }
}
