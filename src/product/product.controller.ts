import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Headers,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { PRODUCT_ROUTE } from '../common/constants/routes.constants';
import { ProductService } from './product.service';
import {
  ProductEntity,
  ProductEntityTranslated,
} from './interfaces/product.interface';
import { Language } from '../common/types/i18n.types';

@Controller(PRODUCT_ROUTE)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(
    @Req() req: Request,
    @Headers('accept-language') language: Language,
  ): Promise<Partial<ProductEntityTranslated>[]> {
    return await this.productService.getProducts({ language });
  }

  @Get('/:productId')
  async getProduct(
    @Param('productId') productId: string,
  ): Promise<ProductEntity | null> {
    return await this.productService.getProduct({ productId });
  }

  @Post()
  async createProduct(
    @Body() entity: ProductEntity,
  ): Promise<ProductEntity | null> {
    return await this.productService.createProduct(entity);
  }

  @Patch()
  async updateProduct(
    @Headers('accept-language') language: Language,
    @Body() data: ProductEntity,
  ) {
    return await this.productService.updateProduct({
      data,
      language,
    });
  }
}
