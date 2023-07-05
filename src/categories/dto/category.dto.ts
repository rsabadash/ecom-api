import {
  IsBoolean,
  IsMongoId,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { URL_SLUG } from '../../common/constants/reg-exp.contants';
import { ICategory } from '../interfaces/categories.interfaces';

export class CategoryDto implements Omit<ICategory, '_id'> {
  @IsMongoId()
  @ApiProperty({
    description: 'Category identifier',
  })
  readonly _id: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Category name translations',
  })
  readonly name: Translations;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message:
      'SEO name of the category should contains only number and Latin letters',
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
    description: 'Parents categories for the category',
    nullable: true,
    default: [],
  })
  readonly parentIds: string[] = [];
}
