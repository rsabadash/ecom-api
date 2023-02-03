import {
  AggregateOptions,
  Collection,
  Filter,
  OptionalId,
  OptionalUnlessRequiredId,
  UpdateFilter,
} from 'mongodb';
import {
  EntityWithId,
  FindEntityOptions,
  PartialEntity,
  PartialEntityUpdate,
  PartialEntityRemoveFields,
  // PartialEntityUpdateArray,
  // UpdateOneArrayOptions,
} from '../types/mongo-query.types';
import { DEFAULT_FIND_OPTIONS } from '../constants/mongo-query.constants';
import {
  UpdateOneResult,
  DeleteOneResult,
  // UpdateOneArrayResult,
} from '../interfaces/colection-model.interfaces';
import { ICollectionModel } from '../interfaces/colection-model.interfaces';

export class CollectionModel<CollectionEntity>
  implements ICollectionModel<CollectionEntity>
{
  constructor(readonly collection: Collection<CollectionEntity>) {}

  async findOne(
    entityQuery?: PartialEntity<CollectionEntity>,
    options?: FindEntityOptions<CollectionEntity>,
  ): Promise<EntityWithId<CollectionEntity> | null> {
    const findOptions = options || {};

    return await this.collection.findOne(entityQuery, findOptions);
  }

  async find(
    entityQuery?: PartialEntity<CollectionEntity>,
    options?: FindEntityOptions<CollectionEntity>,
  ): Promise<EntityWithId<CollectionEntity>[] | []> {
    const findOptions = options
      ? {
          ...DEFAULT_FIND_OPTIONS,
          ...options,
        }
      : DEFAULT_FIND_OPTIONS;

    return await this.collection.find(entityQuery, findOptions).toArray();
  }

  async updateOne(
    entityQuery: PartialEntity<CollectionEntity>,
    setData: PartialEntityUpdate<CollectionEntity>,
  ): Promise<UpdateOneResult> {
    const updatedEntity = await this.collection.updateOne(entityQuery, {
      $set: setData,
    });

    return {
      isUpdated: updatedEntity.modifiedCount > 0 && updatedEntity.acknowledged,
      isFound: updatedEntity.matchedCount > 0,
    };
  }

  async updateWithOperator(
    entityQuery: PartialEntity<CollectionEntity>,
    setData: PartialEntityUpdate<CollectionEntity>,
  ): Promise<UpdateOneResult> {
    const updatedEntity = await this.collection.updateOne(entityQuery, setData);

    return {
      isUpdated: updatedEntity.modifiedCount > 0 && updatedEntity.acknowledged,
      isFound: updatedEntity.matchedCount > 0,
    };
  }

  async updateMany(
    filter: Filter<CollectionEntity>,
    update: UpdateFilter<CollectionEntity>,
  ) {
    return await this.collection.updateMany(filter, update);
  }

  // async updateOneArray(
  //   entityQuery: PartialEntity<CollectionEntity>,
  //   setData: PartialEntityUpdateArray<CollectionEntity>,
  //   options?: UpdateOneArrayOptions,
  // ): Promise<UpdateOneArrayResult> {
  //   const item = await this.collection.findOne(entityQuery);
  //   console.log(item);
  //   const updatedEntity = this.collection.updateOne(entityQuery, {
  //     $push: {
  //       cases: {
  //         $each: [setData],
  //         $sort: -1,
  //       },
  //     },
  //   });
  //
  //   return {
  //     isUpdated: updatedEntity.modifiedCount > 0 && updatedEntity.acknowledged,
  //     isFound: updatedEntity.matchedCount > 0,
  //   };
  // }

  async removeField(
    entityQuery: PartialEntity<CollectionEntity>,
    fieldsToRemove: PartialEntityRemoveFields<CollectionEntity>,
  ): Promise<boolean> {
    const updatedEntity = await this.collection.updateOne(entityQuery, {
      $unset: fieldsToRemove,
    });

    return updatedEntity.modifiedCount > 0;
  }

  async renameField(
    entityQuery: PartialEntity<CollectionEntity>,
    fieldsToRename: Record<string, string>,
  ): Promise<boolean> {
    const updatedEntity = await this.collection.updateOne(entityQuery, {
      $rename: fieldsToRename,
    });

    return updatedEntity.modifiedCount > 0;
  }

  async create(
    entity: OptionalId<CollectionEntity>,
  ): Promise<EntityWithId<CollectionEntity> | null> {
    const typedEntity = entity as OptionalUnlessRequiredId<CollectionEntity>;
    const createdEntity = await this.collection.insertOne(typedEntity);

    if (createdEntity.insertedId) {
      return {
        ...entity,
        _id: createdEntity.insertedId,
      };
    }

    return null;
  }

  async deleteOne(
    entityQuery: PartialEntity<CollectionEntity>,
  ): Promise<DeleteOneResult> {
    const deletedEntity = await this.collection.deleteOne(entityQuery);

    return {
      isDeleted: deletedEntity.deletedCount > 0,
    };
  }

  async aggregate<Result>(
    pipeline,
    options?: AggregateOptions,
  ): Promise<Result[]> {
    return await this.collection.aggregate<Result>(pipeline, options).toArray();
  }
}
