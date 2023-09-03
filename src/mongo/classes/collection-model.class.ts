import {
  AggregateOptions,
  BulkWriteOptions,
  Collection,
  Filter,
  InsertOneOptions,
  OptionalId,
  OptionalUnlessRequiredId,
  UpdateFilter,
} from 'mongodb';
import { Document } from 'bson';
import {
  EntityWithId,
  FindEntityOptions,
  PartialEntity,
  PartialEntityUpdate,
  PartialEntityRemoveFields,
} from '../types/mongo-query.types';
import { DEFAULT_FIND_OPTIONS } from '../constants/mongo-query.constants';
import {
  UpdateOneResult,
  DeleteOneResult,
} from '../interfaces/colection-model.interfaces';
import { ICollectionModel } from '../interfaces/colection-model.interfaces';
import {
  BulkOperations,
  BulkResult,
  Pipeline,
} from '../types/colection-model.types';

export class CollectionModel<CollectionEntity extends Document>
  implements ICollectionModel<CollectionEntity>
{
  constructor(readonly collection: Collection<CollectionEntity>) {}

  async findOne(
    entityQuery: PartialEntity<CollectionEntity> = {},
    options?: FindEntityOptions<CollectionEntity>,
  ): Promise<EntityWithId<CollectionEntity> | null> {
    const findOptions = options || {};

    return await this.collection.findOne(entityQuery, findOptions);
  }

  async find(
    entityQuery: PartialEntity<CollectionEntity> = {},
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
      isFound: updatedEntity.matchedCount > 0,
      isUpdated: updatedEntity.modifiedCount > 0,
    };
  }

  async updateWithOperator(
    entityQuery: PartialEntity<CollectionEntity>,
    filter: UpdateFilter<CollectionEntity>,
  ): Promise<UpdateOneResult> {
    const updatedEntity = await this.collection.updateOne(entityQuery, filter);

    return {
      isFound: updatedEntity.matchedCount > 0,
      isUpdated: updatedEntity.modifiedCount > 0,
    };
  }

  async updateMany(
    filter: Filter<CollectionEntity>,
    update: UpdateFilter<CollectionEntity>,
  ) {
    return await this.collection.updateMany(filter, update);
  }

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
    options: InsertOneOptions = {},
  ): Promise<EntityWithId<CollectionEntity> | null> {
    const typedEntity = entity as OptionalUnlessRequiredId<CollectionEntity>;
    const createdEntity = await this.collection.insertOne(typedEntity, options);

    if (createdEntity.insertedId) {
      return {
        ...entity,
        _id: createdEntity.insertedId,
      };
    }

    return null;
  }

  async createMany(
    entity: OptionalId<CollectionEntity>[],
  ): Promise<EntityWithId<CollectionEntity>[] | null> {
    const typedEntity = entity as OptionalUnlessRequiredId<CollectionEntity>[];
    const createdEntity = await this.collection.insertMany(typedEntity);

    if (createdEntity.insertedCount > 0) {
      return entity.map((entityItem, index) => {
        const entityId = createdEntity.insertedIds[index];

        return {
          ...entityItem,
          _id: entityId,
        };
      });
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async aggregate<Result extends Document>(
    pipeline: Pipeline,
    options?: AggregateOptions,
  ): Promise<Result[]> {
    return await this.collection.aggregate<Result>(pipeline, options).toArray();
  }

  async bulkWrite(
    operations: BulkOperations<CollectionEntity>[],
    options: BulkWriteOptions = {},
  ): Promise<BulkResult> {
    return await this.collection.bulkWrite(operations, options);
  }
}
