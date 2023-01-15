import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { SUPPLIER_COLLECTION } from '../common/constants/collections.constants';
import { ISuppliers } from './interface/suppliers.interface';
import {
  GetSupplierParameters,
  SuppliersEntity,
} from './types/suppliers.types';
import { EntityWithId } from '../mongo/types/mongo-query.types';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectCollectionModel(SUPPLIER_COLLECTION)
    private readonly supplierCollection: ICollectionModel<ISuppliers>,
  ) {}

  async getSuppliers(): Promise<EntityWithId<ISuppliers>[]> {
    return await this.supplierCollection.find();
  }

  async getSupplier(
    parameters: GetSupplierParameters,
  ): Promise<EntityWithId<ISuppliers>> {
    const supplier = await this.supplierCollection.findOne({
      _id: parameters.supplierId,
    });

    if (!supplier) {
      throw new NotFoundException('Not found');
    }

    return supplier;
  }

  async createSupplier(supplier: SuppliersEntity) {
    return this.supplierCollection.create(supplier);
  }

  async updateSupplier(
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<EntityWithId<ISuppliers>> {
    const supplier = await this.getSupplier({
      supplierId: updateSupplierDto.id,
    });

    if (!supplier) {
      throw new UnprocessableEntityException('Unprocessable entity');
    }

    const { id, ...rest } = updateSupplierDto;

    await this.supplierCollection.updateOne({ _id: id }, rest);

    return supplier;
  }

  async deleteSupplier(deleteSupplierDto: DeleteSupplierDto): Promise<void> {
    const supplier = await this.getSupplier({
      supplierId: deleteSupplierDto.id,
    });

    if (!supplier) {
      throw new UnprocessableEntityException('Unprocessable entity');
    }

    await this.supplierCollection.deleteOne({
      _id: deleteSupplierDto.id,
    });
  }
}
