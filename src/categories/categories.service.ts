import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import {
  InjectClients,
  InjectCollectionModel,
} from '../mongo/decorators/mongo.decorators';
import { CATEGORIES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { ICategory, ICategoryDetail } from './interfaces/categories.interfaces';
import { GetCategoryParameters } from './types/categories.types';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { ClientsMap, PartialEntity } from '../mongo/types/mongo-query.types';
import {
  DropdownListItem,
  DropdownListQueryParams,
} from '../common/interfaces/dropdown-list.interface';
import { Language } from '../common/types/i18n.types';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CompareFieldsService } from '../common/services/compare-fields.service';

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
    this.client = this.clients.get(CONNECTION_DB_NAME);
  }

  private filterIdDuplication(
    list: undefined | ObjectId[],
    id: ObjectId,
  ): ObjectId[] {
    const idAsString = id.toString();

    return list?.filter((listId) => listId.toString() !== idAsString);
  }

  async getCategories(
    query: PartialEntity<ICategory> = {},
  ): Promise<ICategory[]> {
    return await this.categoryCollection.find(query);
  }

  async getCategoriesDropdownList(
    language: Language,
    queryParams: DropdownListQueryParams = {},
  ): Promise<DropdownListItem[]> {
    let query: PartialEntity<ICategory> = {};

    if (queryParams._id) {
      query = {
        _id: { $not: { $eq: queryParams._id } },
      };
    }

    const categories = await this.getCategories(query);

    return categories.map((category) => {
      return {
        id: category._id,
        value: category.name[language],
      };
    });
  }

  async getCategory(
    parameters: GetCategoryParameters,
  ): Promise<ICategoryDetail> {
    const categoryDetailArray =
      await this.categoryCollection.aggregate<ICategoryDetail>([
        { $match: { _id: parameters.categoryId } },
        {
          $lookup: {
            from: 'categories',
            localField: 'parentIds',
            foreignField: '_id',
            as: 'parents',
          },
        },
        { $project: { _id: 1, name: 1, isActive: 1, parents: 1 } },
      ]);

    const category = categoryDetailArray[0];

    if (!category) {
      throw new NotFoundException('Not found');
    }

    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory> {
    return await this.categoryCollection.create(createCategoryDto);
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<void> {
    const category = await this.categoryCollection.findOne({
      _id: updateCategoryDto.id,
    });

    if (!category) {
      throw new NotFoundException();
    }

    const comparedFields = this.compareFieldsService.compare<ICategory>(
      updateCategoryDto,
      category,
    );

    let updatedFields = comparedFields.updatedFields;

    if (updatedFields.parentIds) {
      const filteredIds = this.filterIdDuplication(
        updatedFields.parentIds,
        updateCategoryDto.id,
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

    if (!updateResult.isFound) {
      throw new NotFoundException();
    }
  }

  async deleteCategory(deleteCategoryDto: DeleteCategoryDto): Promise<void> {
    const category = await this.categoryCollection.findOne({
      _id: deleteCategoryDto.id,
    });

    if (!category) {
      throw new NotFoundException();
    }

    const session = this.client.startSession();

    try {
      await session.withTransaction(async () => {
        const deleteResult = await this.categoryCollection.deleteOne({
          _id: deleteCategoryDto.id,
        });

        if (!deleteResult.isDeleted) {
          throw new UnprocessableEntityException();
        }

        await this.categoryCollection.updateMany(
          { parentIds: { $in: [category._id] } },
          { $pull: { parentIds: category._id } },
        );
      });
    } finally {
      await session.endSession();
    }
  }
}
