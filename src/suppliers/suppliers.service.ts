import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { SUPPLIERS_COLLECTION } from '../common/constants/collections.constants';
import {
  GetSupplierParameters,
  ISupplier,
  ISupplierCreate,
  ISupplierDelete,
  ISupplierUpdate,
} from './interfaces/suppliers.interfaces';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { EntityNotFoundException } from '../common/exeptions/entity-not-found.exception';
import { DropdownListItem } from '../common/interfaces/dropdown-list.interface';
import { ERROR } from './constants/message.constants';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(SUPPLIERS_COLLECTION)
    private readonly supplierCollection: ICollectionModel<ISupplier>,
  ) {}

  async getSuppliers(): Promise<ISupplier[]> {
    return await this.supplierCollection.find();
  }

  async getSuppliersDropdownList(): Promise<DropdownListItem[]> {
    const suppliers = await this.getSuppliers();

    return suppliers.map((supplier) => {
      return {
        id: supplier._id.toString(),
        value: supplier.name,
      };
    });
  }

  async getSupplier(parameters: GetSupplierParameters): Promise<ISupplier> {
    const supplier = await this.supplierCollection.findOne({
      _id: new ObjectId(parameters.supplierId),
    });

    if (!supplier) {
      throw new EntityNotFoundException(ERROR.SUPPLIER_NOT_FOUND);
    }

    return supplier;
  }

  async createSupplier(createSupplierDto: ISupplierCreate): Promise<ISupplier> {
    const newSupplier = await this.supplierCollection.create(createSupplierDto);

    if (!newSupplier) {
      throw new BadRequestException(ERROR.SUPPLIER_NOT_CREATED);
    }

    return newSupplier;
  }

  async updateSupplier(updateSupplierDto: ISupplierUpdate): Promise<void> {
    const supplier = await this.getSupplier({
      supplierId: updateSupplierDto.id,
    });

    const { _id, updatedFields } = this.compareFieldsService.compare<ISupplier>(
      updateSupplierDto,
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

  async deleteSupplier(deleteSupplierDto: ISupplierDelete): Promise<void> {
    await this.supplierCollection.deleteOne({
      _id: new ObjectId(deleteSupplierDto.id),
    });
  }
}
