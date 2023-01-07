import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SUPPLIERS_ROUTE } from '../common/constants/routes.constants';
import { SuppliersService } from './suppliers.service';
import { SuppliersEntity } from './types/suppliers.types';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller(SUPPLIERS_ROUTE)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  async getSuppliers() {
    return await this.suppliersService.getSuppliers();
  }

  @Get('/:supplierId')
  async getSupplier(
    @Param('supplierId') supplierId: string,
  ): Promise<SuppliersEntity | null> {
    return await this.suppliersService.getSupplier({ supplierId });
  }

  @Post()
  async createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<SuppliersEntity | null> {
    return await this.suppliersService.createSupplier(createSupplierDto);
  }

  @Patch()
  async updateSupplier(
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<SuppliersEntity> {
    return await this.suppliersService.updateSupplier(updateSupplierDto);
  }

  @Delete('/:supplierId')
  async deleteSupplier(@Param('supplierId') supplierId: string): Promise<void> {
    return await this.suppliersService.deleteSupplier({ supplierId });
  }
}
