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
import { ApiProperty } from '@nestjs/swagger';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { URL_SLUG } from '../../common/constants/reg-exp.contants';
import { IVariant } from '../interfaces/variant.interfaces';

export class VariantDto implements IVariant {
  @IsMongoId()
  @ApiProperty({
    description: 'Variant identifier',
  })
  readonly variantId: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'variant name translations',
  })
  readonly name: Translations;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message: 'SEO variant name should contains only number and Latin letters',
  })
  @ApiProperty({
    description: 'Variant name that is used for search engine optimization',
  })
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is variant visible for public users',
  })
  readonly isActive: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Variant sort order',
    nullable: true,
    default: null,
  })
  readonly sortOrder: null | number = null;
}
