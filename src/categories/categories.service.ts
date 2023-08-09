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
    query: PartialEntity<ICategory> = {},
    options: FindEntityOptions<ICategory> = {},
  ): Promise<PaginationData<ICategory>> {
    const { skip, limit } = options;

    const pipeline = getPaginationPipeline<ICategory>({
      query,
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

  async getCategory(parameters: GetCategoryParameters): Promise<ICategory> {
    const category = await this.categoryCollection.findOne({
      _id: new ObjectId(parameters.categoryId),
    });

    if (!category) {
      throw new EntityNotFoundException(ERROR.CATEGORY_NOT_FOUND);
    }

    return category;
  }

  async createCategory(createCategory: ICategoryCreate): Promise<ICategory> {
    const newCategory = await this.categoryCollection.create(createCategory);

    if (!newCategory) {
      throw new BadRequestException(ERROR.CATEGORY_NOT_CREATED);
    }

    return newCategory;
  }

  async updateCategory(updateCategory: ICategoryUpdate): Promise<void> {
    const category = await this.categoryCollection.findOne({
      _id: new ObjectId(updateCategory.id),
    });

    if (!category) {
      throw new EntityNotFoundException(ERROR.CATEGORY_NOT_FOUND);
    }

    const comparedFields = this.compareFieldsService.compare<ICategory>(
      updateCategory,
      category,
    );

    let updatedFields = comparedFields.updatedFields;

    if (updatedFields.parentIds) {
      const filteredIds = updatedFields.parentIds.filter(
        (listId) => listId !== updateCategory.id,
      );

      updatedFields = {
        ...updatedFields,
        parentIds: filteredIds,
      };
    }

    const updateResult = await this.categoryCollection.updateOne(
      { _id: comparedFields._id },
      updatedFields,
    );

    if (!updateResult.isUpdated) {
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
