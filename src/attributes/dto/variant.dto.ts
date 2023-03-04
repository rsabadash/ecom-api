import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';

export class VariantDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the variant',
  })
  readonly variantId: ObjectId;

  @ValidateNested()
  @ValidateNested()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the variant name',
  })
  readonly name: Translations;

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
