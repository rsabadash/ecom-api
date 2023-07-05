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
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierDto } from './dto/supplier.dto';
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
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';
import { ISupplier } from './interfaces/suppliers.interfaces';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../iam/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';
import { DROPDOWN_LIST_PATH } from '../common/constants/path.constants';
import { DropdownListItem } from '../common/interfaces/dropdown-list.interface';
import { DropdownListDto } from '../common/dto/dropdown-list.dto';
import { MODULE_NAME } from '../common/constants/swagger.constants';
import { ERROR, SWAGGER_DESCRIPTION } from './constants/message.constants';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(SUPPLIERS_ROUTE)
@ApiTags(MODULE_NAME.SUPPLIERS)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_SUPPLIERS,
    type: [SupplierDto],
  })
  @ApiNoAccessResponse()
  async getSuppliers(): Promise<ISupplier[]> {
    return await this.suppliersService.getSuppliers();
  }

  @Get(DROPDOWN_LIST_PATH)
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.DROPDOWN_LIST,
    type: DropdownListDto,
  })
  @ApiNoAccessResponse()
  async getSuppliersDropdownList(): Promise<DropdownListItem[]> {
    return await this.suppliersService.getSuppliersDropdownList();
  }

  @Get(GET_SUPPLIER_BY_ID_PATH)
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_SUPPLIER,
    type: SupplierDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.SUPPLIER_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getSupplier(
    @Param(SUPPLIER_ID_PARAM) supplierId: string,
  ): Promise<ISupplier> {
    return await this.suppliersService.getSupplier({ supplierId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SWAGGER_DESCRIPTION.CREATE_SUPPLIER,
    type: SupplierDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.SUPPLIER_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<ISupplier> {
    return await this.suppliersService.createSupplier(createSupplierDto);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SWAGGER_DESCRIPTION.UPDATE_SUPPLIER,
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
    description: SWAGGER_DESCRIPTION.DELETE_SUPPLIER,
  })
  @ApiNoAccessResponse()
  async deleteSupplier(
    @Body() deleteSupplierDto: DeleteSupplierDto,
  ): Promise<void> {
    await this.suppliersService.deleteSupplier(deleteSupplierDto);
  }
}
