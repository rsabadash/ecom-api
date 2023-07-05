import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { URL_SLUG } from '../../common/constants/reg-exp.contants';
import { IVariant } from '../interfaces/variant.interfaces';

export class VariantDto implements IVariant {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the variant',
  })
  readonly variantId: ObjectId;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the variant name',
  })
  readonly name: Translations;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message:
      'SEO name of the variant should contains only number and Latin letters',
  })
  @ApiProperty({
    description:
      'Name of the variant, that used for search engine optimization',
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
