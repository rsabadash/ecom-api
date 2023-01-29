import { ObjectId } from 'mongodb';
import {
  IsBoolean,
  IsMongoId,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';

export class CategoryDto {
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the category',
  })
  readonly _id: ObjectId;

  @ValidateNested()
  @Type(() => TranslationsDto)
  @ApiProperty({
    description: 'Translation object for the category name',
    type: TranslationsDto,
  })
  readonly name: Translations;

  @IsBoolean()
  @ApiProperty({
    description: 'If the category publicly visible',
  })
  readonly isActive: boolean = false;

  @IsMongoId({ each: true })
  @ApiProperty({
    description: 'Parens categories for the category',
  })
  readonly parentIds: ObjectId[] = [];
}
