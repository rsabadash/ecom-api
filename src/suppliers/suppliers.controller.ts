import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { SUPPLIERS_MODULE_NAME } from './suppliers.constants';
import { ApiNoContentResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { HttpStatusMessage } from '../common/constants/swagger.constants';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

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

  @Get('/:supplierId')
  @ApiOkResponse({
    description: 'Supplier was retrieved',
  })
  @ApiForbiddenResponse({
    description: HttpStatusMessage[HttpStatus.NOT_MODIFIED],
  })
  async getSupplier(
    @Param('supplierId') supplierId: string,
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

  @Delete('/:supplierId')
  @ApiOkResponse({ description: 'The supplier has been deleted' })
  @ApiNoContentResponse({ description: 'The supplier does not exit' })
  @ApiForbiddenResponse({
    description: HttpStatusMessage[HttpStatus.FORBIDDEN],
  })
  async deleteSupplier(@Param('supplierId') supplierId: string): Promise<void> {
    return await this.suppliersService.deleteSupplier({ supplierId });
  }
}
