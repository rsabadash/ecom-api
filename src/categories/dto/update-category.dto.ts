import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class UpdateCategoryDto extends PartialType(
  OmitType(CategoryDto, ['_id'] as const),
) {
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the category',
  })
  readonly id: string;
}
