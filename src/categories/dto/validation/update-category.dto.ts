import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { UpdateCategory } from '../../interfaces/category.interface';
import { URL_SLUG } from '../../../common/constants/reg-exp.contants';

export class UpdateCategoryDto implements UpdateCategory {
  @IsMongoId()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name: string;

  @Matches(RegExp(URL_SLUG), {
    message:
      'Only numbers and lowercase Latin letters separated by a hyphen are allowed',
  })
  @IsOptional()
  readonly seoName: string;

  @IsBoolean()
  @IsOptional()
  readonly isActive: boolean;

  @IsMongoId()
  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  readonly parentId: string | null = null;
}
