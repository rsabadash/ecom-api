import { ObjectId } from 'mongodb';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmptyObject,
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
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the category name',
  })
  readonly name: Translations;

  @IsBoolean()
  @ApiProperty({
    description: 'Is the category publicly visible',
  })
  readonly isActive: boolean = false;

  @IsMongoId({ each: true })
  @ApiProperty({
    description: 'Parents categories for the category',
  })
  readonly parentIds: ObjectId[] = [];
}
