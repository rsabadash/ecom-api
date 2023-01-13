import { ObjectId } from 'mongodb';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { SUPPLIERS_ROUTE } from '../common/constants/routes.constants';
import { SuppliersService } from './suppliers.service';
import { SuppliersEntity } from './types/suppliers.types';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierDto } from './dto/supplier.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GET_SUPPLIER_BY_ID_PATH,
  SUPPLIERS_ID_PARAM,
  SUPPLIERS_MODULE_NAME,
} from './suppliers.constants';
import { ApiNoContentResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { HttpStatusMessage } from '../common/constants/swagger.constants';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';
import { ParseBodyObjectIdsPipe } from '../common/pipes/parse-body-objectId.pipe';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectId.pipe';
import { IDeleteSupplier } from './interface/suppliers.interface';

@ApiTags(SUPPLIERS_MODULE_NAME)
@Controller(SUPPLIERS_ROUTE)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOkResponse({
    description: 'Suppliers were retrieved',
  })
  async getSuppliers() {
    return await this.suppliersService.getSuppliers();
  }

  @Get(GET_SUPPLIER_BY_ID_PATH)
  @ApiOkResponse({
    description: 'Supplier was retrieved',
  })
  @ApiForbiddenResponse({
    description: HttpStatusMessage[HttpStatus.NOT_MODIFIED],
  })
  async getSupplier(
    @Param(SUPPLIERS_ID_PARAM, ParseObjectIdPipe) supplierId: ObjectId,
  ): Promise<SuppliersEntity | null> {
    return await this.suppliersService.getSupplier({ supplierId });
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The supplier has been successfully created',
    type: SupplierDto,
  })
  @ApiForbiddenResponse({
    description: HttpStatusMessage[HttpStatus.NOT_MODIFIED],
  })
  async createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<SuppliersEntity | null> {
    return await this.suppliersService.createSupplier(createSupplierDto);
  }

  @UsePipes(
    new ParseBodyObjectIdsPipe<IDeleteSupplier, DeleteSupplierDto>(
      'id',
      'string',
    ),
  )
  @Patch()
  @ApiOkResponse({
    description: 'The supplier has been successfully updated',
    type: SupplierDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_MODIFIED,
    description: HttpStatusMessage[HttpStatus.NOT_MODIFIED],
  })
  @ApiForbiddenResponse({
    description: HttpStatusMessage[HttpStatus.FORBIDDEN],
  })
  async updateSupplier(
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<SuppliersEntity> {
    return await this.suppliersService.updateSupplier(updateSupplierDto);
  }

  @UsePipes(
    new ParseBodyObjectIdsPipe<IDeleteSupplier, DeleteSupplierDto>(
      'id',
      'string',
    ),
  )
  @Delete()
  @ApiOkResponse({ description: 'The supplier has been deleted' })
  @ApiNoContentResponse({ description: 'The supplier does not exit' })
  @ApiForbiddenResponse({
    description: HttpStatusMessage[HttpStatus.FORBIDDEN],
  })
  async deleteSupplier(
    @Body() deleteSupplierDto: DeleteSupplierDto,
  ): Promise<void> {
    return await this.suppliersService.deleteSupplier(deleteSupplierDto);
  }
}
