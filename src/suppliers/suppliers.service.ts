import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { SUPPLIER_COLLECTION } from '../common/constants/collections.constants';
import { ISupplier } from './interfaces/suppliers.interfaces';
import { GetSupplierParameters } from './types/suppliers.types';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { EntityNotFoundException } from '../common/exeptions/EntityNotFoundException';
import { DropdownListItem } from '../common/interfaces/dropdown-list.interface';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(SUPPLIER_COLLECTION)
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
      _id: parameters.supplierId,
    });

    if (!supplier) {
      throw new EntityNotFoundException('The supplier has not been found');
    }

    return supplier;
  }

  async createSupplier(
    createSupplierDto: CreateSupplierDto,
  ): Promise<ISupplier> {
    const newSupplier = await this.supplierCollection.create(createSupplierDto);

    if (!newSupplier) {
      throw new BadRequestException('The supplier has not been created');
    }

    return newSupplier;
  }

  async updateSupplier(updateSupplierDto: UpdateSupplierDto): Promise<void> {
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
      throw new GoneException('The supplier has not been updated');
    }
  }

  async deleteSupplier(deleteSupplierDto: DeleteSupplierDto): Promise<void> {
    await this.supplierCollection.deleteOne({
      _id: deleteSupplierDto.id,
    });
  }
}
