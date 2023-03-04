import { ObjectId } from 'mongodb';
import {
  IsBoolean,
  IsMongoId,
  IsString,
  ValidateNested,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { onlyNumbersAndLatinLetters } from '../../common/constants/regExp.contants';

export class CategoryDto {
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the category',
  })
  readonly _id: ObjectId;

  @ValidateNested()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the category name',
  })
  readonly name: Translations;

  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(onlyNumbersAndLatinLetters), {
    message:
      'SEO name of the category should contains only number and Latin letters',
  })
  @ApiProperty({
    description: 'Name of the category, that used for search optimization',
  })
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is the category publicly visible',
  })
  readonly isActive: boolean = false;

  @IsMongoId({ each: true })
  @ApiProperty({
    description: 'Parents categories for the category',
  })
  readonly parentIds: ObjectId[] = [];
}
