import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DESCRIPTION,
  VALIDATION_MESSAGE,
} from '../../constants/swagger.constants';
import { URL_SLUG } from '../../../common/constants/reg-exp.contants';
import { UpdateVariant } from '../../interfaces/variant.interface';

export class UpdateVariantDto implements UpdateVariant {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.VARIANT_ID)
  readonly variantId: string;

  @IsMongoId()
  @ApiProperty(DESCRIPTION.ATTRIBUTE_ID)
  readonly attributeId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.VARIANT_NAME)
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
  @ApiPropertyOptional(DESCRIPTION.VARIANT_IS_ACTIVE)
  readonly isActive: boolean;
}
