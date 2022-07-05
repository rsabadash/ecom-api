import { Injectable } from '@nestjs/common';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { CATEGORY_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/mongo.interfaces';
import { ICategory } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectCollectionModel(CATEGORY_COLLECTION)
    private readonly categoryCollection: ICollectionModel<ICategory>,
  ) {}

  async getCategories(): Promise<ICategory[]> {
    return await this.categoryCollection.find(
      {},
      { projection: { _id: 0, category: 1 } },
    );
  }
}
