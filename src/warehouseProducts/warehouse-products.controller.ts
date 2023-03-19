import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WAREHOUSE_PRODUCTS_ROUTE } from './constants/route.constants';
import { WAREHOUSE_PRODUCTS_MODULE_NAME } from './constants/swagger.constants';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { WarehouseProductsService } from './warehouse-products.service';
import { CreateWarehouseProductDto } from './dto/create-warehouse-product.dto';
import { IWarehouseProduct } from './interfaces/warehouse-products.interfaces';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { WarehouseProductDto } from './dto/warehouse-product.dto';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';

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
  async getWarehouseProducts() {
    return await this.warehouseProductsService.getWarehouseProducts();
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
