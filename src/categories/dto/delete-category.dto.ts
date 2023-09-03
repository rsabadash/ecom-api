import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICategoryDelete } from '../interfaces/categories.interfaces';

export class DeleteCategoryDto implements ICategoryDelete {
  @IsMongoId()
  @ApiProperty({
    description: 'Category identifier',
  })
  readonly id: string;
}
