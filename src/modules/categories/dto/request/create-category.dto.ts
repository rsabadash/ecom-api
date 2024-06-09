import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { URL_SLUG } from '../../../../common/constants/reg-exp.contants';
import { CreateCategory } from '../../interfaces/category.interface';
import { ApiProperty } from '@nestjs/swagger';
import {
  DESCRIPTION,
  VALIDATION_MESSAGE,
} from '../../constants/swagger.constants';

export class CreateCategoryDto implements CreateCategory {
  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string;

  @Matches(RegExp(URL_SLUG), {
    message: VALIDATION_MESSAGE.SEO_NAME,
  })
  @ApiProperty(DESCRIPTION.SEO_NAME)
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty(DESCRIPTION.IS_ACTIVE)
  readonly isActive: boolean;

  @IsMongoId({ each: true })
  @ApiProperty(DESCRIPTION.CHILDREN_IDS)
  readonly childrenIds: string[] = [];

  @IsMongoId()
  @ValidateIf((_, value) => value !== null)
  @ApiProperty(DESCRIPTION.PARENT_ID)
  readonly parentId: string | null = null;
}
