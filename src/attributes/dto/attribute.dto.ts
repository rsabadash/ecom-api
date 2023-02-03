import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { ApiProperty } from '@nestjs/swagger';
import { AttributeVariantDto } from './attribute-variant.dto';
import { AttributeVariantType } from '../types/attributeVariant.type';

export class AttributeDto {
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: "Attribute's identifier",
  })
  readonly _id: ObjectId;

  @ValidateNested()
  @ApiProperty({
    type: 'string',
    description: "Attribute's name",
  })
  @Type(() => TranslationsDto)
  readonly name: Translations;

  @IsBoolean()
  @ApiProperty({
    type: 'string',
    description: "Attribute's active state",
  })
  readonly isActive: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: "Attribute's sort order. If empty - last in collection",
  })
  readonly sortOrder: number;

  @ValidateNested()
  @ApiProperty({
    type: 'string',
    description: "Attribute's variants",
  })
  @Type(() => AttributeVariantDto)
  readonly variants: AttributeVariantType[] = [];
}
