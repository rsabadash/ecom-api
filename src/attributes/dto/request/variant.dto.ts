import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { URL_SLUG } from '../../../common/constants/reg-exp.contants';
import {
  DESCRIPTION,
  VALIDATION_MESSAGE,
} from '../../constants/swagger.constants';
import { VariantEntity } from '../../interfaces/variant.interface';

export class VariantDto implements VariantEntity {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.VARIANT_ID)
  readonly variantId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.VARIANT_NAME)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message: VALIDATION_MESSAGE.SEO_NAME,
  })
  @ApiProperty(DESCRIPTION.SEO_NAME)
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty(DESCRIPTION.VARIANT_IS_ACTIVE)
  readonly isActive: boolean;
}
