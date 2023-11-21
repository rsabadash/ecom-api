import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WAREHOUSE_PRODUCTS_ROUTE } from './constants/route.constants';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../iam/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { WarehouseProductsService } from './warehouse-products.service';
import { CreateWarehouseProductDto } from './dto/create-warehouse-product.dto';
import { IWarehouseProduct } from './interfaces/warehouse-products.interfaces';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { WarehouseProductDto } from './dto/warehouse-product.dto';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';
import { DROPDOWN_LIST_PATH } from '../common/constants/path.constants';
import { DropdownListDto } from '../common/dto/dropdown-list.dto';
import { Language } from '../common/types/i18n.types';
import { DropdownListItem } from '../common/interfaces/dropdown-list.interface';
import { PaginationData } from '../common/interfaces/pagination.interface';
import { QueryWithPaginationParsed } from '../common/types/query.types';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';
import { MODULE_NAME } from '../common/constants/swagger.constants';
import { ERROR, SWAGGER_DESCRIPTION } from './constants/message';
import { PaginationWarehouseProductDto } from './dto/pagination-warehouse-product.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(WAREHOUSE_PRODUCTS_ROUTE)
@ApiTags(MODULE_NAME.WAREHOUSE_PRODUCTS)
export class WarehouseProductsController {
  constructor(
    private readonly warehouseProductsService: WarehouseProductsService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_WAREHOUSES_PRODUCTS,
    type: [PaginationWarehouseProductDto],
  })
  @ApiNoAccessResponse()
  async getWarehouseProducts(
    @Query(ParsePaginationPipe) query: QueryWithPaginationParsed,
  ): Promise<PaginationData<IWarehouseProduct>> {
    const { page, limit } = query;

    return this.warehouseProductsService.getWarehouseProducts(
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
  async getWarehouseProductsDropdownList(
    @Headers('accept-language') language: Language,
  ): Promise<DropdownListItem[]> {
    return this.warehouseProductsService.getWarehouseProductsDropdownList(
      language,
    );
  }

  @Post()
  @ApiCreatedResponse({
    description: SWAGGER_DESCRIPTION.CREATE_WAREHOUSE_PRODUCTS,
    type: [WarehouseProductDto],
  })
  @ApiBadRequestResponse({
    description: ERROR.WAREHOUSE_PRODUCTS_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createWarehouseProducts(
    @Body() createWarehouseProductsDto: CreateWarehouseProductDto[],
  ): Promise<IWarehouseProduct[]> {
    return this.warehouseProductsService.createWarehouseProducts(
      createWarehouseProductsDto,
    );
  }
}
