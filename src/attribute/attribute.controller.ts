import { Controller, Get, Query } from '@nestjs/common';
import { ATTRIBUTE_ROUTE } from '../common/constants/routes.constants';
import { AttributeService } from './attribute.service';
import { AttributeByCategory } from './interfaces/attribute.interface';

@Controller(ATTRIBUTE_ROUTE)
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Get()
  getAttributesByCategory(
    @Query('category') category: string,
    // @Headers('accept-language') language,
  ): Promise<AttributeByCategory> {
    return this.attributeService.getAttributesByCategory(category);
  }
}
