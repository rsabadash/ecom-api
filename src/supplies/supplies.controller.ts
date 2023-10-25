import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../iam/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import {
  GET_SUPPLY_BY_ID_PATH,
  SUPPLIES_ROUTE,
} from './constants/route.constants';
import { SuppliesService } from './supplies.service';
import { ISupply } from './interfaces/supplies.interfaces';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';
import {
  PaginationData,
  PaginationParsedQuery,
} from '../common/interfaces/pagination.interface';
import { SUPPLY_ID_PARAM } from './constants/param.constants';
import { MODULE_NAME } from '../common/constants/swagger.constants';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { ERROR, SWAGGER_DESCRIPTION } from './constants/message.constants';
import { SupplyDto } from './dto/supply.dto';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { PaginationSupplyDto } from './dto/pagination-supply.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(SUPPLIES_ROUTE)
@ApiTags(MODULE_NAME.SUPPLIES)
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Get()
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_SUPPLIES,
    type: [PaginationSupplyDto],
  })
  @ApiNoAccessResponse()
  async getSupplies(
    @Query(ParsePaginationPipe) query: PaginationParsedQuery,
  ): Promise<PaginationData<ISupply>> {
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
    description: SWAGGER_DESCRIPTION.GET_SUPPLY,
    type: SupplyDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.SUPPLY_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getSupply(@Param(SUPPLY_ID_PARAM) supplyId: string): Promise<ISupply> {
    return this.suppliesService.getSupply({ supplyId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SWAGGER_DESCRIPTION.CREATE_SUPPLY,
    type: SupplyDto,
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
  ): Promise<ISupply> {
    return this.suppliesService.createSupply(createSupplyDto);
  }
}
