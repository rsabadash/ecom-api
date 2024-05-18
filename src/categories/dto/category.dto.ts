import {
  IsBoolean,
  IsMongoId,
  IsString,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { URL_SLUG } from '../../common/constants/reg-exp.contants';
import { ICategoryDto } from '../interfaces/categories.interfaces';

export class CategoryDto implements ICategoryDto {
  @IsMongoId()
  @ApiProperty({
    description: 'Category identifier (returned as ObjectId)',
  })
  readonly _id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category name',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message:
      'SEO name of the category should contains only number and Latin lower case letters',
  })
  @ApiProperty({
    description: 'Name of category, that used for search engine optimization',
  })
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is category visible for public users',
  })
  readonly isActive: boolean;

  @IsMongoId({ each: true })
  @ApiProperty({
    description: 'Children category identifiers for the category',
    default: [],
  })
  readonly childrenIds: string[] = [];

  @IsMongoId({ each: true })
  @ApiProperty({
    description:
      'Parent category identifiers of the category in hierarchy order (index 0 - highest parent, last index - lowest parent)',
    default: [],
  })
  readonly parentIdsHierarchy: string[] = [];
}
