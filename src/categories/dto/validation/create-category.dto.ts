import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { URL_SLUG } from '../../../common/constants/reg-exp.contants';
import { CreateCategory } from '../../interfaces/category.interface';

export class CreateCategoryDto implements CreateCategory {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Matches(RegExp(URL_SLUG), {
    message:
      'Only numbers and lowercase Latin letters separated by a hyphen are allowed',
  })
  readonly seoName: string;

  @IsBoolean()
  readonly isActive: boolean;

  @IsMongoId({ each: true })
  readonly childrenIds: string[] = [];

  @IsMongoId()
  @ValidateIf((_, value) => value !== null)
  readonly parentId: string | null = null;
}
