import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  InjectClients,
  InjectCollectionModel,
} from '../mongo/decorators/mongo.decorators';
import { CATEGORIES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { ICategory, ICategoryDetail } from './interfaces/categories.interfaces';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryKeys, GetCategoryParameters } from './types/categories.types';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { ClientsMap } from '../mongo/types/mongo-query.types';
import { MongoClient } from 'mongodb';
import { DropdownListItem } from '../common/interfaces/dropdown-list.interface';
import { Language } from '../common/types/i18n.types';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { equalObjectsValue, isObjects } from '../common/utils/object.utils';
import { equalArrays, isArrays } from '../common/utils/arrays.utils';

@Injectable()
export class CategoriesService {
  private client: MongoClient;
  constructor(
    @InjectCollectionModel(CATEGORIES_COLLECTION)
    private readonly categoryCollection: ICollectionModel<ICategory>,
    @InjectClients(CONNECTION_DB_NAME)
    private readonly clients: ClientsMap,
  ) {
    this.client = this.clients.get(CONNECTION_DB_NAME);
  }

  static isFieldsEqual(fieldA: any, fieldB: any): boolean {
    if (isObjects(fieldA, fieldB)) {
      return equalObjectsValue(fieldA, fieldB);
    }

    if (isArrays(fieldA, fieldB)) {
      return equalArrays(fieldA, fieldB);
    }

    return String(fieldA) === String(fieldB);
  }

  async getCategories(): Promise<ICategory[]> {
    return await this.categoryCollection.find({});
  }

  async getCategoriesDropdownList(
    language: Language,
  ): Promise<DropdownListItem[]> {
    const categories = await this.getCategories();

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
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory | null> {
    return await this.categoryCollection.create(createCategoryDto);
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<void> {
    const category = await this.categoryCollection.findOne({
      _id: updateCategoryDto.id,
    });

    if (!category) {
      throw new HttpException(
        'Unprocessable entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let updatedFields: Partial<ICategory> = {};

    const { _id, ...rest } = category;
    const categoryKeys = Object.keys(rest) as CategoryKeys;

    categoryKeys.forEach((key) => {
      const dataValue = updateCategoryDto[key];

      if (!CategoriesService.isFieldsEqual(dataValue, category[key])) {
        updatedFields = {
          ...updatedFields,
          [key]: dataValue,
        };
      }
    });

    const updateResult = await this.categoryCollection.updateOne(
      { _id },
      updatedFields,
    );

    if (!updateResult.isFound) {
      throw new HttpException(
        'Unprocessable entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async deleteCategory(deleteCategoryDto: DeleteCategoryDto): Promise<void> {
    const category = await this.categoryCollection.findOne({
      _id: deleteCategoryDto.id,
    });

    if (!category) {
      throw new HttpException(
        'Unprocessable entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = this.client.startSession();

    try {
      await session.withTransaction(async () => {
        const deleteResult = await this.categoryCollection.deleteOne({
          _id: deleteCategoryDto.id,
        });

        if (!deleteResult.isDeleted) {
          throw new HttpException(
            'Unprocessable entity',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
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
