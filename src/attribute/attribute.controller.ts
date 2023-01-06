import { Controller, Get, Query } from '@nestjs/common';
import { ATTRIBUTE_ROUTE } from '../common/constants/routes.constants';
import { AttributeService } from './attribute.service';
import { AttributeByCategory } from './interfaces/attribute.interface';

@Controller(ATTRIBUTE_ROUTE)
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Get()
  async getAttributes(): Promise<AttributeByCategory> {
    return await this.attributeService.getAttributes();
  }

  @Get('/getAttributesByCategory')
  getAttributesByCategory(
    @Query('category') category,
    // @Headers('accept-language') language,
  ): Promise<AttributeByCategory> {
    return this.attributeService.getAttributesByCategory(category);
  }
}
