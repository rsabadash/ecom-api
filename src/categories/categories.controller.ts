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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  ICategory,
  ICategoryWithFullParents,
} from './interfaces/categories.interfaces';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  CATEGORIES_ROUTE,
  GET_CATEGORY_BY_ID_PATH,
} from './constants/route.constants';
import { CATEGORY_ID_PARAM } from './constants/param.constants';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { Language } from '../common/types/i18n.types';
import {
  DropdownListItem,
  DropdownListQueryParams,
} from '../common/interfaces/dropdown-list.interface';
import { DROPDOWN_LIST_PATH } from '../common/constants/path.constants';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../iam/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';
import { DropdownListDto } from '../common/dto/dropdown-list.dto';
import { MODULE_NAME } from '../common/constants/swagger.constants';
import { ERROR, SWAGGER_DESCRIPTION } from './constants/message.constants';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';
import { PaginationData } from '../common/interfaces/pagination.interface';
import { QueryWithPaginationParsed} from '../common/types/query.types';
import { IQueryCategory } from './interfaces/query.interface';
import { PaginationCategoryDto } from './dto/pagination-category.dto';
import { CategoryWithFullParentsDto } from './dto/category-with-full-parents.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(CATEGORIES_ROUTE)
@ApiTags(MODULE_NAME.CATEGORIES)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_CATEGORIES,
    type: [PaginationCategoryDto],
  })
  @ApiNoAccessResponse()
  async getCategories(
    @Query(ParsePaginationPipe) query: QueryWithPaginationParsed<IQueryCategory>,
  ): Promise<PaginationData<ICategory>> {
    const { page, limit, ...restQuery } = query;

    return this.categoriesService.getCategories(
      restQuery,
      {
        skip: page,
        limit: limit,
      },
    );
  }

  @Get(DROPDOWN_LIST_PATH)
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.DROPDOWN_LIST,
    type: DropdownListDto,
  })
  @ApiNoAccessResponse()
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
    description: SWAGGER_DESCRIPTION.GET_CATEGORY,
    type: CategoryWithFullParentsDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.CATEGORY_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getCategory(
    @Param(CATEGORY_ID_PARAM) categoryId: string,
  ): Promise<ICategoryWithFullParents> {
    return this.categoriesService.getCategory({ categoryId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SWAGGER_DESCRIPTION.CREATE_CATEGORY,
    type: CategoryWithFullParentsDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.CATEGORY_NOT_CREATED_WRONG_PARENT_ID,
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.CATEGORY_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ICategoryWithFullParents | void> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SWAGGER_DESCRIPTION.UPDATE_CATEGORY,
  })
  @ApiNotFoundResponse({
    description: ERROR.CATEGORY_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.CATEGORY_NOT_UPDATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    await this.categoriesService.updateCategory(updateCategoryDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SWAGGER_DESCRIPTION.DELETE_CATEGORY,
  })
  @ApiNoAccessResponse()
  async deleteCategory(
    @Body() deleteCategoryDto: DeleteCategoryDto,
  ): Promise<void> {
    await this.categoriesService.deleteCategory(deleteCategoryDto);
  }
}
