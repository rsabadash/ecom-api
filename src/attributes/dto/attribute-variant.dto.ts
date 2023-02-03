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

export class AttributeVariantDto {
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Attribute variant identifier',
  })
  readonly attributeId: ObjectId;

  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Attribute identifier',
  })
  readonly variantId: ObjectId;

  @ValidateNested()
  @ApiProperty({
    type: 'string',
    description: "Attribute's variant name",
  })
  @Type(() => TranslationsDto)
  readonly name: Translations;

  @IsBoolean()
  @ApiProperty({
    type: 'string',
    description: "Attribute's variant active state",
  })
  readonly isActive: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description:
      "Attribute's variant sort order. If empty - last in collection",
  })
  readonly sortOrder: number;
}
