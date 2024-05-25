import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PRODUCTS_ROUTE } from './constants/route.constants';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../iam/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IProduct } from './interfaces/products.interfaces';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { ProductDto } from './dto/product.dto';
import { HttpErrorDto } from '../common/dto/response/http-error.dto';
import { DROPDOWN_LIST_PATH } from '../common/constants/path.constants';
import { DropdownListDto } from '../common/dto/response/dropdown-list.dto';
import { DropdownListItem } from '../common/interfaces/dropdown-list.interface';
import { PaginationData } from '../common/interfaces/pagination.interface';
import { PaginationParsedQuery } from '../common/types/query.types';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';
import { MODULE_NAME } from '../common/constants/swagger.constants';
import { ERROR, SWAGGER_DESCRIPTION } from './constants/message';
import { PaginationProductDto } from './dto/pagination-product.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(PRODUCTS_ROUTE)
@ApiTags(MODULE_NAME.PRODUCTS)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_PRODUCTS,
    type: [PaginationProductDto],
  })
  @ApiNoAccessResponse()
  async getProducts(
    @Query(ParsePaginationPipe) query: PaginationParsedQuery,
  ): Promise<PaginationData<IProduct>> {
    const { page, limit } = query;

    return this.productsService.getProducts(
      {},
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
  async getProductsDropdownList(): Promise<DropdownListItem[]> {
    return this.productsService.getProductsDropdownList();
  }

  @Post()
  @ApiCreatedResponse({
    description: SWAGGER_DESCRIPTION.CREATE_PRODUCTS,
    type: [ProductDto],
  })
  @ApiBadRequestResponse({
    description: ERROR.PRODUCTS_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createProducts(
    @Body() createProductsDto: CreateProductDto[],
  ): Promise<IProduct[]> {
    return this.productsService.createProducts(createProductsDto);
  }
}
