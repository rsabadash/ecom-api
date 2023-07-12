import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { ICategoryUpdate } from '../interfaces/categories.interfaces';

export class UpdateCategoryDto
  extends PartialType(OmitType(CategoryDto, ['_id', 'parentIds'] as const))
  implements ICategoryUpdate
{
  @IsMongoId()
  @ApiProperty({
    description: 'Category identifier',
  })
  readonly id: string;

  @IsMongoId({ each: true })
  @IsOptional()
  @ApiProperty({
    description: 'Parent category identifiers for the category',
  })
  readonly parentIds: string[];
}
