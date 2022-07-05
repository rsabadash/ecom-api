import { Injectable } from '@nestjs/common';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { ATTRIBUTE_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/mongo.interfaces';
import {
  IAttribute,
  AttributeByCategory,
} from './interfaces/attribute.interface';
import { EntityWithId } from '../mongo/types/mongo-query.types';

@Injectable()
export class AttributeService {
  constructor(
    @InjectCollectionModel(ATTRIBUTE_COLLECTION)
    private readonly attributeCollection: ICollectionModel<IAttribute>,
  ) {}

  async getAttributesByCategory(
    category: string,
  ): Promise<AttributeByCategory> {
    const projection = {
      _id: 0,
      key: 1,
      cases: 1,
    };

    const attributes = await this.attributeCollection.find(
      { category },
      { projection },
    );

    const result: AttributeByCategory = {};

    attributes.forEach((attribute: EntityWithId<IAttribute>) => {
      result[attribute.key] = attribute.cases;
    });

    return result;
  }
}
