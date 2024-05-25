import { IsMongoId } from 'class-validator';
import { DeleteCategory } from '../../interfaces/category.interface';

export class DeleteCategoryDto implements DeleteCategory {
  @IsMongoId()
  readonly id: string;
}
