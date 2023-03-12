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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { VariantDto } from './variant.dto';
import { IVariant } from '../interfaces/variant.interfaces';
import { URL_SLUG } from '../../common/constants/reg-exp.contants';

export class AttributeDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the attribute',
  })
  readonly _id: ObjectId;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the attribute name',
  })
  readonly name: Translations;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message:
      'SEO name of the attribute should contains only number and Latin letters',
  })
  @ApiProperty({
    description:
      'Name of the attribute, that used for search engine optimization',
  })
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is the attribute publicly visible',
  })
  readonly isActive: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Sort order of the attribute',
    default: 0,
  })
  readonly sortOrder: number = 0;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @ApiPropertyOptional({
    description: 'Variants of the attribute',
    default: [],
  })
  readonly variants: IVariant[] = [];
}
