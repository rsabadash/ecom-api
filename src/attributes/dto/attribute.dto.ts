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
import { VariantDto } from './variant.dto';
import { IVariant } from '../interfaces/variant.interfaces';
import { URL_SLUG } from '../../common/constants/reg-exp.contants';
import { IAttributeDto } from '../interfaces/attribute.interfaces';

export class AttributeDto implements IAttributeDto {
  @IsMongoId()
  @ApiProperty({
    description: 'Attribute identifier (returned as ObjectId)',
  })
  readonly _id: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Attribute name translations',
  })
  readonly name: Translations;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message: 'SEO attribute name should contains only number and Latin letters',
  })
  @ApiProperty({
    description: 'Attribute name that is used for search engine optimization',
  })
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is attribute visible for public users',
  })
  readonly isActive: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Attribute sort order',
    nullable: true,
    default: null,
  })
  readonly sortOrder: null | number = null;

  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @ApiProperty({
    description: 'Attribute variants',
    nullable: true,
    default: [],
  })
  readonly variants: IVariant[] = [];
}
