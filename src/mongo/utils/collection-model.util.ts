import { Collection, EnhancedOmit } from 'mongodb';
import {
  EntityWithId,
  FindEntityOptions,
  NewEntity,
  PartialEntity,
  PartialEntityUpdate,
  PartialEntityUpdateArray,
  PartialEntityRemoveFields,
  UpdateOneArrayOptions,
} from '../types/mongo-query.types';
import { DEFAULT_FIND_OPTIONS } from '../constants/mongo-query.constants';
import {
  CollectionModelConstructor,
  ICollectionModel,
} from '../interfaces/mongo.interfaces';

export const createCollectionModel = <Entity>(
  ctor: CollectionModelConstructor<Entity>,
  collection: Collection<Entity>,
): ICollectionModel<Entity> => {
  return new ctor(collection);
};

export class CollectionModel<CollectionEntity>
  implements ICollectionModel<CollectionEntity>
{
  constructor(readonly collection: Collection<CollectionEntity>) {}

  async findOne(
    entityQuery?: PartialEntity<CollectionEntity>,
    options?: Omit<FindEntityOptions<CollectionEntity>, 'limit' | 'skip'>,
  ): Promise<EntityWithId<CollectionEntity> | null> {
    const findOptions = options || {};

    return this.collection.findOne(entityQuery, findOptions);
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
  ): Promise<boolean> {
    const updatedEntity = await this.collection.updateOne(entityQuery, {
      $set: setData,
    });

    return updatedEntity.modifiedCount > 0 && updatedEntity.acknowledged;
  }

  async updateOneArray(
    entityQuery: PartialEntity<CollectionEntity>,
    setData: PartialEntityUpdateArray<CollectionEntity>,
    options?: UpdateOneArrayOptions,
  ): Promise<EntityWithId<CollectionEntity> | null> {
    const updateMethod = options?.isUnique ? '$addToSet' : '$push';

    const updatedEntity = await this.collection.findOneAndUpdate(entityQuery, {
      [updateMethod]: setData,
    });

    return updatedEntity.value;
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
    entity: NewEntity<CollectionEntity>,
  ): Promise<EntityWithId<CollectionEntity> | null> {
    const createdEntity = await this.collection.insertOne(entity);

    if (createdEntity.insertedId) {
      const restProperties = entity as EnhancedOmit<CollectionEntity, '_id'>;

      return {
        ...restProperties,
        _id: createdEntity.insertedId,
      };
    }

    return null;
  }

  async deleteOne(
    entityQuery: PartialEntity<CollectionEntity>,
  ): Promise<EntityWithId<CollectionEntity> | null> {
    const deletedEntity = await this.collection.findOneAndDelete(entityQuery);

    return deletedEntity.value;
  }
}
