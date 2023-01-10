import { HttpException, Injectable } from '@nestjs/common';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { SUPPLIER_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/mongo.interfaces';
import { SuppliersInterface } from './interface/suppliers.interface';
import { ObjectId } from 'mongodb';
import { GetSupplierOpts, SuppliersEntity } from './types/suppliers.types';
import { isValidObjectId } from '../common/utils/mongoObjectId.utils';
import { EntityWithId } from '../mongo/types/mongo-query.types';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectCollectionModel(SUPPLIER_COLLECTION)
    private readonly supplierCollection: ICollectionModel<SuppliersInterface>,
  ) {}

  async getSuppliers(): Promise<
    EntityWithId<SuppliersInterface>[] | HttpException
  > {
    return this.supplierCollection.find();
  }

  async getSupplier(
    opts: GetSupplierOpts,
  ): Promise<EntityWithId<SuppliersInterface> | HttpException> {
    return this.supplierCollection.findOne({
      _id: new ObjectId(opts.supplierId),
    });
  }

  async createSupplier(supplier: SuppliersEntity) {
    return this.supplierCollection.create(supplier);
  }

  async updateSupplier(
    data: SuppliersEntity,
  ): Promise<EntityWithId<SuppliersInterface> | HttpException> {
    if (isValidObjectId(data._id)) {
      const { _id, ...rest } = data;

      //handle result
      const result = await this.supplierCollection.updateOne(
        { _id: new ObjectId(_id) },
        rest,
      );

      return this.getSupplier({ supplierId: _id });
    }
  }

  async deleteSupplier(opts: GetSupplierOpts): Promise<void> {
    if (isValidObjectId(opts.supplierId)) {
      //handle result
      const result = await this.supplierCollection.deleteOne({
        _id: new ObjectId(opts.supplierId),
      });
    }
  }
}
