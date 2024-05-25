import {
  BadRequestException,
  GoneException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import {
  InjectClients,
  InjectCollectionModel,
} from '../mongo/decorators/mongo.decorators';
import { CATEGORIES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  CategoryEntity,
  CreateCategory,
  DeleteCategory,
  GetCategoryParameters,
  UpdateCategory,
} from './interfaces/category.interface';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import {
  ClientsMap,
  FindEntityOptions,
  PartialEntity,
} from '../mongo/types/mongo-query.types';
import { DropdownListQuery } from '../common/interfaces/dropdown-list.interface';
import { EntityNotFoundException } from '../common/exeptions/entity-not-found.exception';
import { ERROR } from './constants/swagger.constants';
import { getPaginationPipeline } from '../common/utils/getPaginationPipeline';
import {
  IQueryPipelineCategory,
  GetCategoriseParameters,
} from './interfaces/query.interface';
import { ParentIds } from './enums/parent-ids.enum';
import {
  CategoryDropdownListItem,
  CategoryEntityResponse,
  CreateCategoryResponse,
  GetCategoriesResponse,
  GetCategoryResponse,
} from './interfaces/response.interface';

@Injectable()
export class CategoriesService {
  private client: MongoClient;
  constructor(
    @InjectCollectionModel(CATEGORIES_COLLECTION)
    private readonly categoryCollection: ICollectionModel<CategoryEntity>,
    @InjectClients(CONNECTION_DB_NAME)
    private readonly clients: ClientsMap,
  ) {
    const client = this.clients.get(CONNECTION_DB_NAME);

    if (!client) {
      throw new ServiceUnavailableException(
        'Connection to database is unavailable is CategoriesService',
      );
    }

    this.client = client;
  }

  async getCategories(
    query: GetCategoriseParameters = {},
    options: FindEntityOptions<CategoryEntity> = {},
  ): Promise<GetCategoriesResponse> {
    const { skip, limit } = options;

    const pipelineMatchQuery: IQueryPipelineCategory = {
      $and: [],
    };

    if (query.parentIds) {
      if (query.parentIds === ParentIds.Root) {
        pipelineMatchQuery.$and.push({ parentIdsHierarchy: [] });
      }
    }

    if (query.ids) {
      const objectIdIds = query.ids.split(',').map((id) => new ObjectId(id));

      pipelineMatchQuery.$and.push({ _id: { $in: objectIdIds } });
    }

    // if no query specified, get all items
    if (pipelineMatchQuery.$and.length < 1) {
      pipelineMatchQuery.$and.push({});
    }

    const pipeline = getPaginationPipeline<IQueryPipelineCategory>({
      query: pipelineMatchQuery,
      filter: {
        skip,
        limit,
      },
    });

    // _id typed as string, but actual type is ObjectId
    const paginatedData =
      await this.categoryCollection.aggregate<GetCategoriesResponse>(pipeline);

    return paginatedData[0];
  }

  async getCategoriesDropdownList(
    parameters: DropdownListQuery = {},
  ): Promise<CategoryDropdownListItem[]> {
    let query: PartialEntity<CategoryEntity> = {};

    if (parameters._id) {
      query = {
        _id: { $not: { $eq: new ObjectId(parameters._id) } },
      };
    }

    const categories = await this.categoryCollection.find(query);

    return categories.map((category) => {
      return {
        id: category._id.toString(),
        value: category.name,
      };
    });
  }

  async getCategory(
    parameters: GetCategoryParameters,
  ): Promise<GetCategoryResponse> {
    const pipeline = [
      { $match: { _id: new ObjectId(parameters.categoryId) } },
      {
        $addFields: {
          convertedParentIdsHierarchy: {
            // convert each id from string to ObjectId
            $map: {
              input: '$parentIdsHierarchy',
              as: 'parentId',
              in: { $toObjectId: '$$parentId' },
            },
          },
        },
      },
      {
        $lookup: {
          // from "categories" collection
          from: 'categories',
          // take values from array
          localField: 'convertedParentIdsHierarchy',
          // find value under key "_id"
          foreignField: '_id',
          // return under alias
          as: 'parents',
        },
      },
      {
        $project: {
          parentIdsHierarchy: 0,
          convertedParentIdsHierarchy: 0,
        },
      },
    ];

    const category =
      await this.categoryCollection.aggregate<GetCategoryResponse>(pipeline);

    if (!category.length) {
      throw new EntityNotFoundException(ERROR.CATEGORY_NOT_FOUND);
    }

    return category[0];
  }

  async createCategory(
    createCategory: CreateCategory,
  ): Promise<CreateCategoryResponse> {
    let parent: CategoryEntity | null = null;
    const { parentId, ...restCreateCategory } = createCategory;

    if (parentId) {
      // check if parent category exists
      parent = await this.categoryCollection.findOne({
        _id: new ObjectId(parentId),
      });

      if (!parent) {
        throw new BadRequestException(
          `${ERROR.CATEGORY_NOT_CREATED_WRONG_PARENT_ID} (${parentId})`,
        );
      }
    }

    const higherParentIds = parent ? parent.parentIdsHierarchy : [];
    // add all parent ids from the direct parent to the category to keep hierarchy
    const newParentIdsHierarchy = parentId
      ? [...higherParentIds, parentId]
      : [];

    const newCategoryData: Omit<CategoryEntity, '_id'> = {
      ...restCreateCategory,
      childrenIds: [],
      parentIdsHierarchy: newParentIdsHierarchy,
    };

    const newCategory = await this.categoryCollection.create(newCategoryData);

    if (!newCategory) {
      throw new BadRequestException(ERROR.CATEGORY_NOT_CREATED);
    }

    if (parent) {
      // add the new category as a child to the direct parent
      const updatedFields: Partial<CategoryEntity> = {
        childrenIds: [...parent.childrenIds, newCategory._id.toString()],
      };

      const updateResult = await this.categoryCollection.updateOne(
        { _id: new ObjectId(parent._id) },
        updatedFields,
      );

      // TODO update error
      if (!updateResult.isUpdated) {
        throw new GoneException(ERROR.CATEGORY_NOT_UPDATED);
      }
    }

    const { _id, name, seoName, isActive, childrenIds } = newCategory;

    const parents: CategoryEntityResponse[] = parent
      ? [
          {
            ...parent,
            _id: parent._id.toString(),
            childrenIds: [...parent.childrenIds, _id.toString()],
          },
        ]
      : [];

    return {
      _id: _id.toString(),
      name,
      seoName,
      parents,
      isActive,
      childrenIds,
    };
  }

  async updateCategory(updateCategory: UpdateCategory): Promise<void> {
    const {
      parentId: newParentId,
      id: currentCategoryId,
      ...restUpdateCategoryValues
    } = updateCategory;
    const currentCategoryObjectId = new ObjectId(currentCategoryId);

    const category = await this.categoryCollection.findOne({
      _id: currentCategoryObjectId,
    });

    if (!category) {
      throw new EntityNotFoundException(ERROR.CATEGORY_NOT_FOUND);
    }

    let parent: CategoryEntity | null = null;

    const { parentIdsHierarchy: parentCurrentIdsHierarchy } = category;
    const hasCurrentParentIds = parentCurrentIdsHierarchy.length > 0;

    // direct parent id always the last in hierarchy (index 0 - the highest parent, last index - lowest (direct) parent)
    const directCurrentParentId: string | null = hasCurrentParentIds
      ? parentCurrentIdsHierarchy[parentCurrentIdsHierarchy.length - 1]
      : null;

    // update direct children ids
    // if new parentId potentially has to be changed and current direct parentId is not equal to the new one
    if (directCurrentParentId !== newParentId) {
      if (newParentId) {
        const newParentObjectId = new ObjectId(newParentId);

        // check if new parent is not a child of the current category
        const isNewParentAsChild = await this.categoryCollection.findOne({
          _id: newParentObjectId,
          parentIdsHierarchy: currentCategoryId,
        });

        if (isNewParentAsChild) {
          throw new BadRequestException(
            'You have selected as a parent category the one that is a child for the current category',
          );
        }

        parent = await this.categoryCollection.findOne({
          _id: newParentObjectId,
        });

        if (!parent) {
          throw new BadRequestException(
            `${ERROR.CATEGORY_NOT_CREATED_WRONG_PARENT_ID} (${newParentId})`,
          );
        }

        // add to the new direct parent the current category as a child
        const updateNewParentResult =
          await this.categoryCollection.updateWithOperator(
            { _id: newParentObjectId },
            { $push: { childrenIds: currentCategoryId } },
          );

        if (!updateNewParentResult.isUpdated) {
          throw new GoneException(ERROR.CATEGORY_NOT_UPDATED);
        }
      }

      if (directCurrentParentId) {
        // remove from previous direct parent the current category as a child
        const updateOldParentResult =
          await this.categoryCollection.updateWithOperator(
            { _id: new ObjectId(directCurrentParentId) },
            { $pull: { childrenIds: currentCategoryId } },
          );

        if (!updateOldParentResult.isUpdated) {
          throw new GoneException(ERROR.CATEGORY_NOT_UPDATED);
        }
      }
    }

    // update parent ids hierarchy
    // if current direct parentId is not equal to the new one
    if (directCurrentParentId !== newParentId) {
      const newParentHierarchy = parent?.parentIdsHierarchy || [];
      const newFulHierarchy = newParentId
        ? [...newParentHierarchy, newParentId]
        : newParentHierarchy;

      if (directCurrentParentId) {
        // add new hierarchy to all items that contain directCurrentParentId in parentIdsHierarchy
        const filter = newParentId
          ? // but not to the new direct parent itself
            {
              _id: { $not: { $eq: new ObjectId(newParentId) } },
              parentIdsHierarchy: directCurrentParentId,
            }
          : { parentIdsHierarchy: directCurrentParentId };

        await this.categoryCollection.updateMany(filter, [
          {
            $set: {
              parentIdsHierarchy: {
                $concatArrays: [
                  // add hierarchy from the new parent
                  newFulHierarchy,
                  {
                    $slice: [
                      '$parentIdsHierarchy',
                      // { $indexOfArray: [ '$parentIdsHierarchy', directCurrentParentId ] } - find index of direct parent in parentIdsHierarchy
                      // { $add: [ '$index', 1 ] } - pick everything after found index
                      {
                        $add: [
                          {
                            $indexOfArray: [
                              '$parentIdsHierarchy',
                              directCurrentParentId,
                            ],
                          },
                          1,
                        ],
                      },
                      // { $size: '$parentIdsHierarchy' } - slice from direct parent + 1 till the end of parentIdsHierarchy
                      { $size: '$parentIdsHierarchy' },
                    ],
                  },
                ],
              },
            },
          },
        ]);
      } else {
        // if no direct parent id for the category it means that category was a direct parent for other categories
        // or direct parent for the current category was removed
        await this.categoryCollection.updateMany(
          {
            $or: [
              { 'parentIdsHierarchy.0': currentCategoryId },
              { _id: currentCategoryObjectId },
            ],
          },
          [
            {
              $set: {
                parentIdsHierarchy: {
                  $concatArrays: [newFulHierarchy, '$parentIdsHierarchy'],
                },
              },
            },
          ],
        );
      }
    }

    const updateResult = await this.categoryCollection.updateOne(
      { _id: currentCategoryObjectId },
      restUpdateCategoryValues,
    );

    if (!updateResult.isUpdated && !updateResult.isFound) {
      throw new GoneException(ERROR.CATEGORY_NOT_UPDATED);
    }
  }

  async deleteCategory(deleteCategory: DeleteCategory): Promise<void> {
    const { id: deleteCategoryId } = deleteCategory;
    const deleteCategoryObjectId = new ObjectId(deleteCategoryId);

    const category = await this.categoryCollection.findOne({
      _id: deleteCategoryObjectId,
    });

    if (!category) {
      throw new EntityNotFoundException(ERROR.CATEGORY_NOT_FOUND);
    }

    const session = this.client.startSession();

    const {
      parentIdsHierarchy: parentCurrentIdsHierarchy,
      childrenIds: childrenCurrentIds,
    } = category;
    const hasCurrentParentIds = parentCurrentIdsHierarchy.length > 0;
    const hasCurrentChildrenIds = childrenCurrentIds.length > 0;

    // direct parent id always the last in hierarchy (index 0 - highest parent, last index - lowest (direct) parent)
    const directCurrentParentId: string | null = hasCurrentParentIds
      ? parentCurrentIdsHierarchy[parentCurrentIdsHierarchy.length - 1]
      : null;

    try {
      await session.withTransaction(async () => {
        if (directCurrentParentId && hasCurrentChildrenIds) {
          // direct parent of the category that will be deleted becomes a direct parent to children of the deleted category
          // children should be re-assigned from deleted to the new direct parent category
          await this.categoryCollection.updateWithOperator(
            {
              _id: new ObjectId(directCurrentParentId),
            },
            {
              $push: { childrenIds: { $each: childrenCurrentIds } },
            },
          );
        }

        await this.categoryCollection.deleteOne({
          _id: deleteCategoryObjectId,
        });

        // find and remove the category id that will be deleted in all parentIdsHierarchy or childrenIds
        await this.categoryCollection.updateMany(
          {
            $or: [
              { parentIdsHierarchy: deleteCategory.id },
              { childrenIds: deleteCategory.id },
            ],
          },
          {
            $pull: {
              parentIdsHierarchy: deleteCategory.id,
              childrenIds: deleteCategory.id,
            },
          },
        );
      });
    } finally {
      await session.endSession();
    }
  }
}
