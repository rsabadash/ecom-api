import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import {
  GET_SUPPLY_BY_ID_PATH,
  SUPPLIES_ROUTE,
} from './constants/route.constants';
import { SuppliesService } from './supplies.service';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';
import { SUPPLY_ID_PARAM } from './constants/param.constants';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { ERROR, SUCCESS, MODULE_NAME } from './constants/swagger.constants';
import { HttpErrorDto } from '../common/dto/response/http-error.dto';
import { CreateSupplyDto } from './dto/request/create-supply.dto';
import { GetSuppliesResponseDto } from './dto/response/get-supplies-response.dto';
import {
  CreateSupplyResponse,
  GetSuppliesResponse,
  GetSupplyResponse,
} from './interfaces/response.interface';
import { GetSuppliesQueryDto } from './dto/request/get-supplies-query.dto';
import { GetSupplyResponseDto } from './dto/response/get-supply-response.dto';
import { CreateSupplyResponseDto } from './dto/response/create-supply-response.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(SUPPLIES_ROUTE)
@ApiTags(MODULE_NAME)
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Get()
  @ApiOkResponse({
    description: SUCCESS.GET_SUPPLIES,
    type: GetSuppliesResponseDto,
  })
  @ApiNoAccessResponse()
  async getSupplies(
    @Query(ParsePaginationPipe) query: GetSuppliesQueryDto,
  ): Promise<GetSuppliesResponse> {
    const { page, limit } = query;

    return this.suppliesService.getSupplies(
      {},
      {
        skip: page,
        limit: limit,
      },
    );
  }

  @Get(GET_SUPPLY_BY_ID_PATH)
  @ApiOkResponse({
    description: SUCCESS.GET_SUPPLY,
    type: GetSupplyResponseDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.SUPPLY_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getSupply(
    @Param(SUPPLY_ID_PARAM) supplyId: string,
  ): Promise<GetSupplyResponse> {
    return this.suppliesService.getSupply({ supplyId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SUCCESS.CREATE_SUPPLY,
    type: CreateSupplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.NO_PRODUCTS_FOUND,
  })
  @ApiBadRequestResponse({
    description: ERROR.NO_PRODUCTS_TO_ADD,
  })
  @ApiBadRequestResponse({
    description: ERROR.SUPPLY_NOT_CREATED,
  })
  @ApiBadRequestResponse({
    description: ERROR.NO_PRODUCTS_TO_UPDATE,
  })
  @ApiBadRequestResponse({
    description: ERROR.NO_PRODUCTS_WERE_UPDATED,
  })
  @ApiNoAccessResponse()
  async createSupply(
    @Body() createSupplyDto: CreateSupplyDto,
  ): Promise<CreateSupplyResponse> {
    return this.suppliesService.createSupply(createSupplyDto);
  }
}
