import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { SUPPLIER_COLLECTION } from '../common/constants/collections.constants';
import { ISupplier } from './interface/suppliers.interfaces';
import { GetSupplierParameters } from './types/suppliers.types';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectCollectionModel(SUPPLIER_COLLECTION)
    private readonly supplierCollection: ICollectionModel<ISupplier>,
  ) {}

  async getSuppliers(): Promise<ISupplier[]> {
    return await this.supplierCollection.find({});
  }

  async getSupplier(parameters: GetSupplierParameters): Promise<ISupplier> {
    const supplier = await this.supplierCollection.findOne({
      _id: parameters.supplierId,
    });

    if (!supplier) {
      throw new NotFoundException();
    }

    return supplier;
  }

  async createSupplier(
    createSupplierDto: CreateSupplierDto,
  ): Promise<ISupplier> {
    return await this.supplierCollection.create(createSupplierDto);
  }

  async updateSupplier(updateSupplierDto: UpdateSupplierDto): Promise<void> {
    const supplier = await this.getSupplier({
      supplierId: updateSupplierDto.id,
    });

    if (!supplier) {
      throw new NotFoundException();
    }

    const { id, ...rest } = updateSupplierDto;

    await this.supplierCollection.updateOne({ _id: id }, rest);
  }

  async deleteSupplier(deleteSupplierDto: DeleteSupplierDto): Promise<void> {
    const supplier = await this.getSupplier({
      supplierId: deleteSupplierDto.id,
    });

    if (!supplier) {
      throw new NotFoundException();
    }

    const deleteResult = await this.supplierCollection.deleteOne({
      _id: deleteSupplierDto.id,
    });

    if (!deleteResult.isDeleted) {
      throw new UnprocessableEntityException();
    }
  }
}
