import { ObjectId } from 'mongodb';
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
  UsePipes,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierDto } from './dto/supplier.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SUPPLIERS_MODULE_NAME } from './constants/swagger.constants';
import {
  GET_SUPPLIER_BY_ID_PATH,
  SUPPLIERS_ROUTE,
} from './constants/route.constants';
import { SUPPLIERS_ID_PARAM } from './constants/param.constants';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';
import { ParseObjectIdsPipe } from '../common/pipes/parse-body-objectId.pipe';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectId.pipe';
import {
  IDeleteSupplier,
  ISupplier,
  IUpdateSupplier,
} from './interfaces/suppliers.interfaces';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';

@Auth(AuthType.Bearer)
@Roles(Role.Admin)
@Controller(SUPPLIERS_ROUTE)
@ApiTags(SUPPLIERS_MODULE_NAME)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of suppliers were retrieved',
    type: [SupplierDto],
  })
  @ApiNoAccessResponse()
  async getSuppliers(): Promise<ISupplier[]> {
    return await this.suppliersService.getSuppliers();
  }

  @Get(GET_SUPPLIER_BY_ID_PATH)
  @ApiOkResponse({
    description: 'The supplier was retrieved',
    type: SupplierDto,
  })
  @ApiNotFoundResponse({
    description: 'The supplier has not been found',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getSupplier(
    @Param(SUPPLIERS_ID_PARAM, ParseObjectIdPipe) supplierId: ObjectId,
  ): Promise<ISupplier> {
    return await this.suppliersService.getSupplier({ supplierId });
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The supplier has been created',
    type: SupplierDto,
  })
  @ApiBadRequestResponse({
    description: 'The supplier has not been created',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<ISupplier> {
    return await this.suppliersService.createSupplier(createSupplierDto);
  }

  @UsePipes(new ParseObjectIdsPipe<IUpdateSupplier>('id', 'string'))
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The supplier has been updated',
  })
  @ApiNotFoundResponse({
    description: 'The supplier has not been found',
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'The supplier has not been updated',
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
    description: 'The supplier has been deleted',
  })
  @ApiNotFoundResponse({
    description: 'The supplier has not been found',
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'The supplier has not been deleted',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  @UsePipes(new ParseObjectIdsPipe<IDeleteSupplier>('id', 'string'))
  async deleteSupplier(
    @Body() deleteSupplierDto: DeleteSupplierDto,
  ): Promise<void> {
    await this.suppliersService.deleteSupplier(deleteSupplierDto);
  }
}
