import { ObjectId } from 'mongodb';
import { IsBoolean, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Translations } from '../../common/types/i18n.types';
import { TranslationsDto } from '../../common/dto/translations.dto';

export class CreateCategoryDto {
  @ValidateNested()
  @Type(() => TranslationsDto)
  readonly name: Translations;

  @IsBoolean()
  readonly isActive: boolean;

  @IsMongoId({ each: true })
  readonly parentIds: ObjectId[];
}
