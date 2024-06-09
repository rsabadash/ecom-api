import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PRODUCTS_ROUTE } from './constants/route.constants';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ApiNoAccessResponse } from '../../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../../common/dto/response/http-error.dto';
import { DROPDOWN_LIST_PATH } from '../../common/constants/path.constants';
import { DropdownListDto } from '../../common/dto/response/dropdown-list.dto';
import { ParsePaginationPipe } from '../../common/pipes/parse-pagination.pipe';
import { MODULE_NAME } from './constants/swagger.constants';
import { ERROR, SUCCESS } from './constants/swagger.constants';
import { GetProductsResponseDto } from './dto/response/get-product-response.dto';
import {
  CreateProductsResponse,
  GetProductsResponse,
  ProductDropdownListItem,
} from './interfaces/response.interface';
import { GetProductsQueryDto } from './dto/request/get-products-query.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(PRODUCTS_ROUTE)
@ApiTags(MODULE_NAME)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({
    description: SUCCESS.GET_PRODUCTS,
    type: [GetProductsResponseDto],
  })
  @ApiNoAccessResponse()
  async getProducts(
    @Query(ParsePaginationPipe) query: GetProductsQueryDto,
  ): Promise<GetProductsResponse> {
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
    description: SUCCESS.DROPDOWN_LIST,
    type: DropdownListDto,
  })
  @ApiNoAccessResponse()
  async getProductsDropdownList(): Promise<ProductDropdownListItem[]> {
    return this.productsService.getProductsDropdownList();
  }

  @Post()
  @ApiCreatedResponse({
    description: SUCCESS.CREATE_PRODUCTS,
    type: [CreateProductDto],
  })
  @ApiBadRequestResponse({
    description: ERROR.PRODUCTS_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createProducts(
    @Body() createProductsDto: CreateProductDto[],
  ): Promise<CreateProductsResponse[]> {
    return this.productsService.createProducts(createProductsDto);
  }
}
