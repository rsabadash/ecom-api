import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import {
  GET_SUPPLY_BY_ID_PATH,
  GET_SUPPLY_PRODUCTS,
  SUPPLIES_ROUTE,
} from './constants/route.constants';
import { SUPPLIES_MODULE_NAME } from './constants/swagger.constants';
import { SuppliesService } from './supplies.service';
import { ISupply, ISupplyProduct } from './interfaces/supplies.interfaces';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';
import {
  PaginationData,
  PaginationParsedQuery,
} from '../common/interfaces/pagination.interface';
import { SUPPLY_ID_PARAM } from './constants/param.constants';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(SUPPLIES_ROUTE)
@ApiTags(SUPPLIES_MODULE_NAME)
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Get()
  async getSupplies(
    @Query(ParsePaginationPipe) query: PaginationParsedQuery,
  ): Promise<PaginationData<ISupply>> {
    const { page, limit } = query;

    return await this.suppliesService.getSupplies(
      {},
      {
        skip: page,
        limit: limit,
      },
    );
  }

  @Get(GET_SUPPLY_BY_ID_PATH)
  async getSupply(@Param(SUPPLY_ID_PARAM) supplyId: string): Promise<ISupply> {
    return this.suppliesService.getSupply({ supplyId });
  }

  @Get(`${GET_SUPPLY_PRODUCTS}${GET_SUPPLY_BY_ID_PATH}`)
  async getSupplyProducts(
    @Param(SUPPLY_ID_PARAM) supplyId: string,
  ): Promise<PaginationData<ISupplyProduct>> {
    return this.suppliesService.getSupplyProducts({ supplyId });
  }

  @Post()
  async createSupply(@Body() createSupplyDto: any): Promise<ISupply> {
    return await this.suppliesService.createSupply(createSupplyDto);
  }
}
