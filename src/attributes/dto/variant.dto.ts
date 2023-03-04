import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { onlyNumbersAndLatinLetters } from '../../common/constants/regExp.contants';

export class VariantDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the variant',
  })
  readonly variantId: ObjectId;

  @ValidateNested()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the variant name',
  })
  readonly name: Translations;

  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(onlyNumbersAndLatinLetters), {
    message:
      'SEO name of the variant should contains only number and Latin letters',
  })
  @ApiProperty({
    description: 'Name of the variant, that used for search optimization',
  })
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is the variant publicly visible',
  })
  readonly isActive: boolean = false;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Sort order of the variant',
  })
  readonly sortOrder: number = 0;
}
