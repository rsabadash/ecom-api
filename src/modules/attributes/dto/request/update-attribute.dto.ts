import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { UpdateAttribute } from '../../interfaces/attribute.interface';
import {
  DESCRIPTION,
  VALIDATION_MESSAGE,
} from '../../constants/swagger.constants';
import { URL_SLUG } from '../../../../common/constants/reg-exp.contants';

export class UpdateAttributeDto implements UpdateAttribute {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ATTRIBUTE_ID)
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.ATTRIBUTE_NAME)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
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
}
