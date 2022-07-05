import { Controller, Get } from '@nestjs/common';
import { CATEGORY_ROUTE } from '../common/constants/routes.constants';
import { CategoryService } from './category.service';
import { ICategory } from './interfaces/category.interface';

@Controller(CATEGORY_ROUTE)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategories(): Promise<ICategory[]> {
    return this.categoryService.getCategories();
  }
}
