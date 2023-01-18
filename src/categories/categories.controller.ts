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
import { CategoriesService } from './categories.service';
import {
  ICategory,
  ICategoryDetail,
  ICreateCategory,
  IDeleteCategory,
  IUpdateCategory,
} from './interfaces/categories.interfaces';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ParseObjectIdsPipe } from '../common/pipes/parse-body-objectId.pipe';
import {
  CATEGORIES_ROUTE,
  GET_CATEGORY_BY_ID_PATH,
} from './constants/route.constants';
import { CATEGORY_ID_PARAM } from './constants/param.constants';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectId.pipe';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { Language } from '../common/types/i18n.types';
import { DropdownListItem } from '../common/interfaces/dropdown-list.interface';
import { DROPDOWN_LIST_PATH } from '../common/constants/path.constants';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';

@Auth(AuthType.Bearer)
@Controller(CATEGORIES_ROUTE)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(Role.Admin)
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
  ): Promise<ICategoryDetail> {
    return await this.categoriesService.getCategory({ categoryId });
  }

  @UsePipes(new ParseObjectIdsPipe<ICreateCategory>('parentIds', 'array'))
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @UsePipes(
    new ParseObjectIdsPipe<IUpdateCategory>(
      ['id', 'parentIds'],
      ['string', 'array'],
    ),
  )
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    await this.categoriesService.updateCategory(updateCategoryDto);
  }

  @UsePipes(new ParseObjectIdsPipe<IDeleteCategory>('id', 'string'))
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(
    @Body() deleteCategoryDto: DeleteCategoryDto,
  ): Promise<void> {
    await this.categoriesService.deleteCategory(deleteCategoryDto);
  }
}
