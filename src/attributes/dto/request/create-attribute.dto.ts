import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { VariantDto } from './variant.dto';
import { VariantEntity } from '../../interfaces/variant.interface';
import { URL_SLUG } from '../../../common/constants/reg-exp.contants';
import { CreateAttribute } from '../../interfaces/attribute.interface';
import {
  DESCRIPTION,
  VALIDATION_MESSAGE,
} from '../../constants/swagger.constants';

export class CreateAttributeDto implements CreateAttribute {
  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.ATTRIBUTE_NAME)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message: VALIDATION_MESSAGE.SEO_NAME,
  })
  @ApiProperty(DESCRIPTION.SEO_NAME)
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty(DESCRIPTION.IS_ACTIVE)
  readonly isActive: boolean;

  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @ApiProperty(DESCRIPTION.VARIANTS)
  readonly variants: VariantEntity[] | null = [];
}
