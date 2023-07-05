import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { ICategoryUpdate } from '../interfaces/categories.interfaces';

export class UpdateCategoryDto
  extends PartialType(OmitType(CategoryDto, ['_id'] as const))
  implements ICategoryUpdate
{
  @IsMongoId()
  @ApiProperty({
    description: 'Category identifier',
  })
  readonly id: string;
}
