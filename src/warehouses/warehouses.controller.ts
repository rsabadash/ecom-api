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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { WarehouseDto } from './dto/warehouse.dto';
import { IWarehouse } from './interfaces/warehouses.interfaces';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import {
  GET_WAREHOUSE_BY_ID_PATH,
  WAREHOUSES_ROUTE,
} from './constants/route.constants';
import { WAREHOUSES_MODULE_NAME } from './constants/swagger.constants';
import { WAREHOUSE_ID_PARAM } from './constants/param.constants';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { DeleteWarehouseDto } from './dto/delete-warehouse.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(WAREHOUSES_ROUTE)
@ApiTags(WAREHOUSES_MODULE_NAME)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of warehouses was retrieved',
    type: [WarehouseDto],
  })
  @ApiNoAccessResponse()
  async getWarehouses(): Promise<IWarehouse[]> {
    return await this.warehousesService.getWarehouses();
  }

  @Get(GET_WAREHOUSE_BY_ID_PATH)
  @ApiOkResponse({
    description: 'The warehouse was retrieved',
    type: WarehouseDto,
  })
  @ApiNotFoundResponse({
    description: 'The warehouse has not been found',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getWarehouse(
    @Param(WAREHOUSE_ID_PARAM) warehouseId: string,
  ): Promise<IWarehouse> {
    return await this.warehousesService.getWarehouse({ warehouseId });
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The warehouse has been created',
    type: WarehouseDto,
  })
  @ApiBadRequestResponse({
    description: 'The warehouse has not been created',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createWarehouse(
    @Body() createWarehouse: CreateWarehouseDto,
  ): Promise<IWarehouse> {
    return await this.warehousesService.createWarehouse(createWarehouse);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The warehouse has been updated',
  })
  @ApiNotFoundResponse({
    description: 'The warehouse has not been found',
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'The warehouse has not been updated',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async updateWarehouse(
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<void> {
    return await this.warehousesService.updateWarehouse(updateWarehouseDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The warehouse has been deleted',
  })
  @ApiNoAccessResponse()
  async deleteWarehouse(
    @Body() deleteWarehouseDto: DeleteWarehouseDto,
  ): Promise<void> {
    await this.warehousesService.deleteWarehouse(deleteWarehouseDto);
  }
}
