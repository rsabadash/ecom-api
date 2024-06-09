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
  Query,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/request/create-supplier.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GET_SUPPLIER_BY_ID_PATH,
  SUPPLIERS_ROUTE,
} from './constants/route.constants';
import { SUPPLIER_ID_PARAM } from './constants/param.constants';
import { UpdateSupplierDto } from './dto/request/update-supplier.dto';
import { DeleteSupplierDto } from './dto/request/delete-supplier.dto';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ApiNoAccessResponse } from '../../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../../common/dto/response/http-error.dto';
import { DROPDOWN_LIST_PATH } from '../../common/constants/path.constants';
import { DropdownListDto } from '../../common/dto/response/dropdown-list.dto';
import { MODULE_NAME } from './constants/swagger.constants';
import { ERROR, SUCCESS } from './constants/swagger.constants';
import { ParsePaginationPipe } from '../../common/pipes/parse-pagination.pipe';
import {
  CreateSupplierResponse,
  GetSupplierResponse,
  GetSuppliersResponse,
  SupplierDropdownListItem,
} from './interfaces/response.interface';
import { GetSuppliersResponseDto } from './dto/response/get-suppliers-response.dto';
import { GetSupplierResponseDto } from './dto/response/get-supplier-response.dto';
import { CreateSupplierResponseDto } from './dto/response/create-supplier-response.dto';
import { GetSuppliersQueryDto } from './dto/request/get-suppliers-query.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(SUPPLIERS_ROUTE)
@ApiTags(MODULE_NAME)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOkResponse({
    description: SUCCESS.GET_SUPPLIERS,
    type: GetSuppliersResponseDto,
  })
  @ApiNoAccessResponse()
  async getSuppliers(
    @Query(ParsePaginationPipe) query: GetSuppliersQueryDto,
  ): Promise<GetSuppliersResponse> {
    const { page, limit } = query;

    return this.suppliersService.getSuppliers(
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
  async getSuppliersDropdownList(): Promise<SupplierDropdownListItem[]> {
    return this.suppliersService.getSuppliersDropdownList();
  }

  @Get(GET_SUPPLIER_BY_ID_PATH)
  @ApiOkResponse({
    description: SUCCESS.GET_SUPPLIER,
    type: GetSupplierResponseDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.SUPPLIER_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getSupplier(
    @Param(SUPPLIER_ID_PARAM) supplierId: string,
  ): Promise<GetSupplierResponse> {
    return this.suppliersService.getSupplier({ supplierId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SUCCESS.CREATE_SUPPLIER,
    type: CreateSupplierResponseDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.SUPPLIER_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<CreateSupplierResponse> {
    return this.suppliersService.createSupplier(createSupplierDto);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SUCCESS.UPDATE_SUPPLIER,
  })
  @ApiNotFoundResponse({
    description: ERROR.SUPPLIER_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiGoneResponse({
    description: ERROR.SUPPLIER_NOT_UPDATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async updateSupplier(
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<void> {
    await this.suppliersService.updateSupplier(updateSupplierDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SUCCESS.DELETE_SUPPLIER,
  })
  @ApiNoAccessResponse()
  async deleteSupplier(
    @Body() deleteSupplierDto: DeleteSupplierDto,
  ): Promise<void> {
    await this.suppliersService.deleteSupplier(deleteSupplierDto);
  }
}
