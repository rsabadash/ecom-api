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
import { SUPPLIERS_ROUTE } from '../common/constants/routes.constants';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierDto } from './dto/supplier.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SUPPLIERS_MODULE_NAME } from './constants/swagger.constants';
import { GET_SUPPLIER_BY_ID_PATH } from './constants/path.constants';
import { SUPPLIERS_ID_PARAM } from './constants/param.constants';
import { ApiNoContentResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { HttpStatusMessage } from '../common/constants/swagger.constants';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';
import { ParseObjectIdsPipe } from '../common/pipes/parse-body-objectId.pipe';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectId.pipe';
import {
  IDeleteSupplier,
  ISupplier,
  IUpdateSupplier,
} from './interfaces/suppliers.interfaces';

@ApiTags(SUPPLIERS_MODULE_NAME)
@Controller(SUPPLIERS_ROUTE)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOkResponse({
    description: 'Suppliers were retrieved',
    type: [SupplierDto],
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusMessage[HttpStatus.UNAUTHORIZED],
  })
  async getSuppliers(): Promise<ISupplier[]> {
    return await this.suppliersService.getSuppliers();
  }

  @Get(GET_SUPPLIER_BY_ID_PATH)
  @ApiOkResponse({
    description: 'The supplier was retrieved',
    type: SupplierDto,
  })
  @ApiNotFoundResponse({
    description: HttpStatusMessage[HttpStatus.NOT_FOUND],
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusMessage[HttpStatus.UNAUTHORIZED],
  })
  async getSupplier(
    @Param(SUPPLIERS_ID_PARAM, ParseObjectIdPipe) supplierId: ObjectId,
  ): Promise<ISupplier> {
    return await this.suppliersService.getSupplier({ supplierId });
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The supplier has been successfully created',
    type: SupplierDto,
  })
  @ApiNotFoundResponse({
    description: HttpStatusMessage[HttpStatus.NOT_FOUND],
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusMessage[HttpStatus.UNAUTHORIZED],
  })
  async createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<ISupplier> {
    return await this.suppliersService.createSupplier(createSupplierDto);
  }

  @UsePipes(new ParseObjectIdsPipe<IUpdateSupplier>('id', 'string'))
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The supplier has been successfully updated',
  })
  @ApiNotFoundResponse({
    description: HttpStatusMessage[HttpStatus.NOT_FOUND],
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusMessage[HttpStatus.UNAUTHORIZED],
  })
  async updateSupplier(
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<void> {
    await this.suppliersService.updateSupplier(updateSupplierDto);
  }

  @UsePipes(new ParseObjectIdsPipe<IDeleteSupplier>('id', 'string'))
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'The supplier has been deleted' })
  @ApiUnauthorizedResponse({
    description: HttpStatusMessage[HttpStatus.UNAUTHORIZED],
  })
  @ApiUnprocessableEntityResponse({
    description: HttpStatusMessage[HttpStatus.UNPROCESSABLE_ENTITY],
  })
  async deleteSupplier(
    @Body() deleteSupplierDto: DeleteSupplierDto,
  ): Promise<void> {
    await this.suppliersService.deleteSupplier(deleteSupplierDto);
  }
}
