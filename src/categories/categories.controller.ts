import {
  Body,
  Controller,
  Delete,
  Get,
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
  CATEGORIES_ROUTE,
  GET_CATEGORY_BY_ID_PATH,
} from './constants/route.constants';
import { CATEGORY_ID_PARAM } from './constants/param.constants';
import { DROPDOWN_LIST_PATH } from '../common/constants/path.constants';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/response/http-error.dto';
import { DropdownListDto } from '../common/dto/response/dropdown-list.dto';
import { ERROR, SUCCESS, MODULE_NAME } from './constants/swagger.constants';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';
import { GetCategoriesQueryDto } from './dto/request/get-categoreis-query.dto';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { DeleteCategoryDto } from './dto/request/delete-category.dto';
import {
  CategoryDropdownListItem,
  CreateCategoryResponse,
  GetCategoriesResponse,
  GetCategoryResponse,
} from './interfaces/response.interface';
import { GetCategoriesResponseDto } from './dto/response/get-categories-response.dto';
import { DropdownListQueryDto } from '../common/dto/validations/dropdown-list.dto';
import { CreateCategoryResponseDto } from './dto/response/create-category-response.dto';
import { GetCategoryResponseDto } from './dto/response/get-category-response.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(CATEGORIES_ROUTE)
@ApiTags(MODULE_NAME)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({
    description: SUCCESS.GET_CATEGORIES,
    type: GetCategoriesResponseDto,
  })
  @ApiNoAccessResponse()
  async getCategories(
    @Query(ParsePaginationPipe)
    query: GetCategoriesQueryDto,
  ): Promise<GetCategoriesResponse> {
    const { page, limit, ...restQuery } = query;

    return this.categoriesService.getCategories(restQuery, {
      skip: page,
      limit,
    });
  }

  @Get(DROPDOWN_LIST_PATH)
  @ApiOkResponse({
    description: SUCCESS.DROPDOWN_LIST,
    type: DropdownListDto,
  })
  @ApiNoAccessResponse()
  async getCategoriesDropdownList(
    @Query() query: DropdownListQueryDto,
  ): Promise<CategoryDropdownListItem[]> {
    return this.categoriesService.getCategoriesDropdownList(query);
  }

  @Get(GET_CATEGORY_BY_ID_PATH)
  @ApiOkResponse({
    description: SUCCESS.GET_CATEGORY,
    type: GetCategoryResponseDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.CATEGORY_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getCategory(
    @Param(CATEGORY_ID_PARAM) categoryId: string,
  ): Promise<GetCategoryResponse> {
    return this.categoriesService.getCategory({ categoryId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SUCCESS.CREATE_CATEGORY,
    type: CreateCategoryResponseDto,
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
  ): Promise<CreateCategoryResponse> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SUCCESS.UPDATE_CATEGORY,
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
    description: SUCCESS.DELETE_CATEGORY,
  })
  @ApiNoAccessResponse()
  async deleteCategory(
    @Body() deleteCategoryDto: DeleteCategoryDto,
  ): Promise<void> {
    await this.categoriesService.deleteCategory(deleteCategoryDto);
  }
}
