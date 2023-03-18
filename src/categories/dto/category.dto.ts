import { ObjectId } from 'mongodb';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmptyObject,
  IsString,
  IsOptional,
  ValidateNested,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { URL_SLUG } from '../../common/constants/reg-exp.contants';

export class CategoryDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the category',
  })
  readonly _id: ObjectId;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the category name',
  })
  readonly name: Translations;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message:
      'SEO name of the category should contains only number and Latin letters',
  })
  @ApiProperty({
    description:
      'Name of the category, that used for search engine optimization',
  })
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is the category publicly visible',
  })
  readonly isActive: boolean;

  @IsMongoId({ each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Parents categories for the category',
    default: [],
  })
  readonly parentIds: ObjectId[] = [];
}
