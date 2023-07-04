import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WAREHOUSE_PRODUCTS_ROUTE } from './constants/route.constants';
import { WAREHOUSE_PRODUCTS_MODULE_NAME } from './constants/swagger.constants';
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
import {
  PaginationData,
  PaginationParsedQuery,
} from 'src/common/interfaces/pagination.interface';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(WAREHOUSE_PRODUCTS_ROUTE)
@ApiTags(WAREHOUSE_PRODUCTS_MODULE_NAME)
export class WarehouseProductsController {
  constructor(
    private readonly warehouseProductsService: WarehouseProductsService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'List of warehouses products was retrieved',
    type: [WarehouseProductDto],
  })
  @ApiNoAccessResponse()
  async getWarehouseProducts(
    @Query(ParsePaginationPipe) query: PaginationParsedQuery,
  ): Promise<PaginationData<IWarehouseProduct>> {
    const { page, limit } = query;

    return await this.warehouseProductsService.getWarehouseProducts(
      {},
      {
        skip: page,
        limit: limit,
      },
    );
  }

  @Get(DROPDOWN_LIST_PATH)
  @ApiOkResponse({
    description: 'Dropdown list of warehouse products',
    type: DropdownListDto,
  })
  @ApiNoAccessResponse()
  async getCategoriesDropdownList(
    @Headers('accept-language') language: Language,
  ): Promise<DropdownListItem[]> {
    return this.warehouseProductsService.getWarehouseProductsDropdownList(
      language,
    );
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Warehouse products have been created',
    type: [WarehouseProductDto],
  })
  @ApiBadRequestResponse({
    description: 'Warehouse products have not been created',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createWarehouseProducts(
    @Body() createWarehouseProductsDto: CreateWarehouseProductDto[],
  ): Promise<IWarehouseProduct[] | null> {
    return await this.warehouseProductsService.createWarehouseProducts(
      createWarehouseProductsDto,
    );
  }
}
