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
  ICategory,
  ICategoryCreate,
  ICategoryDelete,
  ICategoryUpdate,
  GetCategoryParameters,
  ICategoryWithFullParents,
} from './interfaces/categories.interfaces';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import {
  ClientsMap,
  FindEntityOptions,
  PartialEntity,
} from '../mongo/types/mongo-query.types';
import {
  DropdownListItem,
  DropdownListQueryParams,
} from '../common/interfaces/dropdown-list.interface';
import { Language } from '../common/types/i18n.types';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { EntityNotFoundException } from '../common/exeptions/entity-not-found.exception';
import { DEFAULT_LANGUAGE } from '../common/constants/internationalization.constants';
import { ERROR } from './constants/message.constants';
import { getPaginationPipeline } from '../common/utils/getPaginationPipeline';
import { PaginationData } from '../common/interfaces/pagination.interface';
import { IQueryCategory, IQueryPipelineCategory } from './interfaces/query.interface';

@Injectable()
export class CategoriesService {
  private client: MongoClient;
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(CATEGORIES_COLLECTION)
    private readonly categoryCollection: ICollectionModel<ICategory>,
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
    query: IQueryCategory = {},
    options: FindEntityOptions<ICategory> = {},
  ): Promise<PaginationData<ICategory>> {
    const { skip, limit } = options;

    let pipelineMatchQuery: IQueryPipelineCategory = {};

    if (query.parentIds) {
      if (query.parentIds === 'root') {
        pipelineMatchQuery.parentIdsHierarchy = [];
      }
    }

    if (query.ids) {
      const objectIdIds = query.ids.split(',').map((id) => new ObjectId(id));

      pipelineMatchQuery._id = { '$in': objectIdIds };
    }

    const pipeline = getPaginationPipeline<IQueryPipelineCategory>({
      query: pipelineMatchQuery,
      filter: {
        skip,
        limit,
      },
    });

    const paginatedData = await this.categoryCollection.aggregate<
      PaginationData<ICategory>
    >(pipeline);

    return paginatedData[0];
  }

  async getCategoriesDropdownList(
    language: Language,
    queryParams: DropdownListQueryParams = {},
  ): Promise<DropdownListItem[]> {
    let query: PartialEntity<ICategory> = {};

    if (queryParams._id) {
      query = {
        _id: { $not: { $eq: new ObjectId(queryParams._id) } },
      };
    }

    const categories = await this.categoryCollection.find(query);

    return categories.map((category) => {
      return {
        id: category._id.toString(),
        value: category.name[language] || category.name[DEFAULT_LANGUAGE],
      };
    });
  }

  async getCategory(
    parameters: GetCategoryParameters,
  ): Promise<ICategoryWithFullParents> {
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
      await this.categoryCollection.aggregate<ICategoryWithFullParents>(
        pipeline,
      );

    if (!category.length) {
      throw new EntityNotFoundException(ERROR.CATEGORY_NOT_FOUND);
    }

    return category[0];
  }

  async createCategory(
    createCategory: ICategoryCreate,
  ): Promise<ICategoryWithFullParents> {
    let parent: ICategory | null = null;
    const { parentId, ...restCreateCategory } = createCategory;

    if (parentId) {
      // check if parent category exists
      parent = await this.categoryCollection.findOne({ _id: new ObjectId(parentId) });

      if (!parent) {
        throw new BadRequestException(`${ERROR.CATEGORY_NOT_CREATED_WRONG_PARENT_ID} (${parentId})`);
      }
    }

    const higherParentIds = parent ? parent.parentIdsHierarchy : [];
    // add all parent ids from the direct parent to the category to keep hierarchy
    const newParentIdsHierarchy = parentId ? [...higherParentIds, parentId] : [];

    const newCategoryData: Omit<ICategory, '_id'> = {
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
      const updatedFields: Partial<ICategory> = {
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
    const parents: ICategory[] = parent
        ? [{
            ...parent,
            childrenIds: [
              ...parent.childrenIds,
              _id.toString()
            ]
          }]
        : [];

    return {
      _id,
      name,
      seoName,
      parents,
      isActive,
      childrenIds,
    };
  }

  async updateCategory(updateCategory: ICategoryUpdate): Promise<void> {
    const { parentId: newParentId, id: currentCategoryId, ...restUpdateCategoryValues } = updateCategory;
    const currentCategoryObjectId = new ObjectId(currentCategoryId);

    const category = await this.categoryCollection.findOne({
      _id: currentCategoryObjectId,
    });

    if (!category) {
      throw new EntityNotFoundException(ERROR.CATEGORY_NOT_FOUND);
    }

    let parent: ICategory | null = null;

    const { parentIdsHierarchy: parentCurrentIdsHierarchy } = category;
    const hasCurrentParentIds = parentCurrentIdsHierarchy.length > 0;

    // direct parent id always the last in hierarchy (index 0 - highest parent, last index - lowest (direct) parent)
    const directCurrentParentId: string | null = hasCurrentParentIds ? parentCurrentIdsHierarchy[parentCurrentIdsHierarchy.length - 1] : null;

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
          throw new BadRequestException('You have selected as a parent category the one that is a child for the current category');
        }

        parent = await this.categoryCollection.findOne({ _id: newParentObjectId });

        if (!parent) {
          throw new BadRequestException(`${ERROR.CATEGORY_NOT_CREATED_WRONG_PARENT_ID} (${newParentId})`);
        }

        // add to the new direct parent the current category as a child
        const updateNewParentResult = await this.categoryCollection.updateWithOperator(
            { _id: newParentObjectId },
            { $push: { childrenIds: currentCategoryId } },
        );

        if (!updateNewParentResult.isUpdated) {
          throw new GoneException(ERROR.CATEGORY_NOT_UPDATED);
        }
      }

      if (directCurrentParentId) {
        // remove from previous direct parent the current category as a child
        const updateOldParentResult = await this.categoryCollection.updateWithOperator(
            { _id: new ObjectId(directCurrentParentId) },
            { $pull: { childrenIds: { $in: [currentCategoryId] } } },
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
      const newFulHierarchy = newParentId ? [...newParentHierarchy, newParentId] : newParentHierarchy;

      if (directCurrentParentId) {
        await this.categoryCollection.updateMany(
          { 'parentIdsHierarchy': directCurrentParentId },
          [
            { $set: {
              parentIdsHierarchy: {
                $concatArrays: [
                  // add hierarchy from the new parent
                  newFulHierarchy,
                  {
                    $slice: [
                      '$parentIdsHierarchy',
                      // { $indexOfArray: [ '$parentIdsHierarchy', directCurrentParentId ] } - find index of direct parent in parentIdsHierarchy
                      // { $add: [ '$index', 1 ] } - pick everything after found index
                      { $add: [ { $indexOfArray: [ '$parentIdsHierarchy', directCurrentParentId ] }, 1 ] },
                      // { $size: '$parentIdsHierarchy' } - slice from direct parent + 1 till the end of parentIdsHierarchy
                      { $size: '$parentIdsHierarchy' },
                    ],
                  },
                ],
              }
            } },
          ]);
      } else {
        // if no direct parent id for the category it means that category was a direct parent for other categories
        // or direct parent for the current category was removed
        await this.categoryCollection.updateMany(
    { $or: [ { 'parentIdsHierarchy.0': currentCategoryId }, { _id: currentCategoryObjectId } ] },
  [
            { $set: { parentIdsHierarchy: { $concatArrays: [ newFulHierarchy, '$parentIdsHierarchy' ] } } },
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

  async deleteCategory(deleteCategory: ICategoryDelete): Promise<void> {
    const session = this.client.startSession();

    try {
      await session.withTransaction(async () => {
        await this.categoryCollection.deleteOne({
          _id: new ObjectId(deleteCategory.id),
        });

        await this.categoryCollection.updateMany(
          { parentIds: { $in: [deleteCategory.id] } },
          { $pull: { parentIds: deleteCategory.id } },
        );
      });
    } finally {
      await session.endSession();
    }
  }
}
