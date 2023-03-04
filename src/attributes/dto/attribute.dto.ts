import {
  IsBoolean,
  IsMongoId,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { VariantDto } from './variant.dto';
import { IVariant } from '../interfaces/variant.interfaces';

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
