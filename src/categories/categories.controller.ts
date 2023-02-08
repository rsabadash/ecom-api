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
  Query,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import {
  DropdownListItem,
  DropdownListQueryParams,
} from '../common/interfaces/dropdown-list.interface';
import { DROPDOWN_LIST_PATH } from '../common/constants/path.constants';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { CategoryDto } from './dto/category.dto';
import { CATEGORIES_MODULE_NAME } from './constants/swagger.constants';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(CATEGORIES_ROUTE)
@ApiTags(CATEGORIES_MODULE_NAME)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of categories were retrieved',
    type: [CategoryDto],
  })
  @ApiNoAccessResponse()
  async getCategories(): Promise<ICategory[]> {
    return await this.categoriesService.getCategories();
  }

  @UsePipes(new ParseObjectIdsPipe<ICategory>('_id', 'string'))
  @Get(DROPDOWN_LIST_PATH)
  async getCategoriesDropdownList(
    @Query() queryParams: DropdownListQueryParams,
    @Headers('accept-language') language: Language,
  ): Promise<DropdownListItem[]> {
    return this.categoriesService.getCategoriesDropdownList(
      language,
      queryParams,
    );
  }

  @Get(GET_CATEGORY_BY_ID_PATH)
  @ApiOkResponse({
    description: 'The category was retrieved',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'The category has not been found',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getProduct(
    @Param(CATEGORY_ID_PARAM, ParseObjectIdPipe) categoryId: ObjectId,
  ): Promise<ICategoryDetail> {
    return await this.categoriesService.getCategory({ categoryId });
  }

  @UsePipes(new ParseObjectIdsPipe<ICreateCategory>('parentIds', 'array'))
  @Post()
  @ApiCreatedResponse({
    description: 'The category has been created',
    type: CategoryDto,
  })
  @ApiBadRequestResponse({
    description: 'The category has not been created',
    type: HttpErrorDto,
  })
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
  @ApiNoContentResponse({
    description: 'The category has been updated',
  })
  @ApiNotFoundResponse({
    description: 'The category has not been found',
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'The category has not been updated',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    await this.categoriesService.updateCategory(updateCategoryDto);
  }

  @UsePipes(new ParseObjectIdsPipe<IDeleteCategory>('id', 'string'))
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The category has been deleted',
  })
  @ApiNotFoundResponse({
    description: 'The category has not been found',
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'The category has not been deleted',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async deleteCategory(
    @Body() deleteCategoryDto: DeleteCategoryDto,
  ): Promise<void> {
    await this.categoriesService.deleteCategory(deleteCategoryDto);
  }
}
