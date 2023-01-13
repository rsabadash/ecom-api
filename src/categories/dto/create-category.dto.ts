import { ObjectId } from 'mongodb';
import { IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Translations } from '../../common/types/i18n.types';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { IsMongoObjectId } from '../../common/decorators/is-mongo-objectId.decorator';

export class CreateCategoryDto {
  @ValidateNested()
  @Type(() => TranslationsDto)
  readonly name: Translations;

  @IsBoolean()
  readonly isActive: boolean;

  @IsMongoObjectId({ each: true })
  readonly parentIds: ObjectId[];
}
