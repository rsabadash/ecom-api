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
import { HttpErrorDto } from '../common/dto/response/http-error.dto';
import { CreateWarehouseDto } from './dto/request/create-warehouse.dto';
import {
  GET_WAREHOUSE_BY_ID_PATH,
  WAREHOUSES_ROUTE,
} from './constants/route.constants';
import { WAREHOUSE_ID_PARAM } from './constants/param.constants';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../iam/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { UpdateWarehouseDto } from './dto/request/update-warehouse.dto';
import { DeleteWarehouseDto } from './dto/request/delete-warehouse.dto';
import { DROPDOWN_LIST_PATH } from '../common/constants/path.constants';
import { DropdownListDto } from '../common/dto/response/dropdown-list.dto';
import { ERROR, SUCCESS } from './constants/swagger.constants';
import { MODULE_NAME } from './constants/swagger.constants';
import { GetWarehouseResponseDto } from './dto/response/get-warehouse-response.dto';
import {
  CreateWarehouseResponse,
  GetWarehouseResponse,
  GetWarehousesResponse,
  WarehouseDropdownListItem,
} from './interface/response.interface';
import { GetWarehousesResponseDto } from './dto/response/get-warehouses-response.dto';
import { CreateWarehouseResponseDto } from './dto/response/create-warehouse-response.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(WAREHOUSES_ROUTE)
@ApiTags(MODULE_NAME)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  @ApiOkResponse({
    description: SUCCESS.GET_WAREHOUSES,
    type: [GetWarehousesResponseDto],
  })
  @ApiNoAccessResponse()
  async getWarehouses(): Promise<GetWarehousesResponse[]> {
    return this.warehousesService.getWarehouses();
  }

  @Get(DROPDOWN_LIST_PATH)
  @ApiOkResponse({
    description: SUCCESS.DROPDOWN_LIST,
    type: DropdownListDto,
  })
  @ApiNoAccessResponse()
  async getWarehousesDropdownList(): Promise<WarehouseDropdownListItem[]> {
    return this.warehousesService.getWarehousesDropdownList();
  }

  @Get(GET_WAREHOUSE_BY_ID_PATH)
  @ApiOkResponse({
    description: SUCCESS.GET_WAREHOUSE,
    type: GetWarehouseResponseDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.WAREHOUSE_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getWarehouse(
    @Param(WAREHOUSE_ID_PARAM) warehouseId: string,
  ): Promise<GetWarehouseResponse> {
    return this.warehousesService.getWarehouse({ warehouseId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SUCCESS.CREATE_WAREHOUSE,
    type: CreateWarehouseResponseDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.WAREHOUSE_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createWarehouse(
    @Body() createWarehouse: CreateWarehouseDto,
  ): Promise<CreateWarehouseResponse> {
    return this.warehousesService.createWarehouse(createWarehouse);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SUCCESS.UPDATE_WAREHOUSE,
  })
  @ApiNotFoundResponse({
    description: ERROR.WAREHOUSE_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.WAREHOUSE_NOT_UPDATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async updateWarehouse(
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<void> {
    return this.warehousesService.updateWarehouse(updateWarehouseDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SUCCESS.DELETE_WAREHOUSE,
  })
  @ApiNoAccessResponse()
  async deleteWarehouse(
    @Body() deleteWarehouseDto: DeleteWarehouseDto,
  ): Promise<void> {
    await this.warehousesService.deleteWarehouse(deleteWarehouseDto);
  }
}
