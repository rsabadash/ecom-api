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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DESCRIPTION,
  VALIDATION_MESSAGE,
} from '../../constants/swagger.constants';

export class UpdateCategoryDto implements UpdateCategory {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ID)
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.NAME)
  readonly name: string;

  @Matches(RegExp(URL_SLUG), {
    message: VALIDATION_MESSAGE.SEO_NAME,
  })
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.SEO_NAME)
  readonly seoName: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.IS_ACTIVE)
  readonly isActive: boolean;

  @IsMongoId()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @ApiPropertyOptional(DESCRIPTION.PARENT_ID)
  readonly parentId: string | null = null;
}
