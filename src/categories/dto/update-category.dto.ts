import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { ICategoryUpdate } from '../interfaces/categories.interfaces';

export class UpdateCategoryDto
  extends PartialType(OmitType(CategoryDto, ['_id', 'childrenIds', 'parentIdsHierarchy'] as const))
  implements ICategoryUpdate
{
  @IsMongoId()
  @ApiProperty({
    description: 'Category identifier',
  })
  readonly id: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    description: 'Parent category identifier for the category',
    nullable: true,
    default: null,
  })
  readonly parentId: string | null = null;
}
