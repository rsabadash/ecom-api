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
import { VariantDto } from './variant.dto';
import { IVariant } from '../interfaces/variant.interfaces';
import { onlyNumbersAndLatinLetters } from '../../common/constants/regExp.contants';

export class AttributeDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the attribute',
  })
  readonly _id: ObjectId;

  @ValidateNested()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the attribute name',
  })
  readonly name: Translations;

  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(onlyNumbersAndLatinLetters), {
    message:
      'SEO name of the attribute should contains only number and Latin letters',
  })
  @ApiProperty({
    description: 'Name of the attribute, that used for search optimization',
  })
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is the attribute publicly visible',
  })
  readonly isActive: boolean = false;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Sort order of the attribute',
  })
  readonly sortOrder: number = 0;

  @IsOptional()
  @ValidateNested()
  @Type(() => VariantDto)
  @ApiProperty({
    description: 'Variants of the attribute',
  })
  readonly variants: IVariant[] = [];
}
