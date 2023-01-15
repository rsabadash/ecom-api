import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CATEGORIES_ROUTE } from '../common/constants/routes.constants';
import { CategoriesService } from './categories.service';
import {
  ICategory,
  ICategoryDetail,
  ICreateCategory,
  IDeleteCategory,
  IUpdateCategory,
} from './interfaces/categories.interfaces';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ParseBodyObjectIdsPipe } from '../common/pipes/parse-body-objectId.pipe';
import { GET_CATEGORY_BY_ID_PATH } from './constants/path.constants';
import { CATEGORY_ID_PARAM } from './constants/param.constants';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectId.pipe';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { Language } from '../common/types/i18n.types';
import { DropdownListItem } from '../common/interfaces/dropdown-list.interface';
import { DROPDOWN_LIST_PATH } from '../common/constants/path.constants';
import { UpdateCategoryDto } from './dto/update-category.dto';
// import { Roles } from '../iam/decorators/roles.decorator';
// import { Role } from '../iam/enums/role.enum';

@Controller(CATEGORIES_ROUTE)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // @Roles(Role.Admin)
  @Get()
  async getCategories(): Promise<ICategory[]> {
    return await this.categoriesService.getCategories();
  }

  @Get(DROPDOWN_LIST_PATH)
  async getCategoriesDropdownList(
    @Headers('accept-language') language: Language,
  ): Promise<DropdownListItem[]> {
    return this.categoriesService.getCategoriesDropdownList(language);
  }

  @Get(GET_CATEGORY_BY_ID_PATH)
  async getProduct(
    @Param(CATEGORY_ID_PARAM, ParseObjectIdPipe) categoryId: ObjectId,
  ): Promise<ICategoryDetail | null> {
    return await this.categoriesService.getCategory({ categoryId });
  }

  @UsePipes(
    new ParseBodyObjectIdsPipe<ICreateCategory, CreateCategoryDto>(
      'parentIds',
      'array',
    ),
  )
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory | null> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @UsePipes(
    new ParseBodyObjectIdsPipe<IUpdateCategory, UpdateCategoryDto>(
      ['id', 'parentIds'],
      ['string', 'array'],
    ),
  )
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    return await this.categoriesService.updateCategory(updateCategoryDto);
  }

  @UsePipes(
    new ParseBodyObjectIdsPipe<IDeleteCategory, DeleteCategoryDto>(
      'id',
      'string',
    ),
  )
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(
    @Body() deleteCategoryDto: DeleteCategoryDto,
  ): Promise<void> {
    return await this.categoriesService.deleteCategory(deleteCategoryDto);
  }
}
