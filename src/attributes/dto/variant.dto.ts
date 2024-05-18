import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { URL_SLUG } from '../../common/constants/reg-exp.contants';
import { IVariant } from '../interfaces/variant.interfaces';

export class VariantDto implements IVariant {
  @IsMongoId()
  @ApiProperty({
    description: 'Variant identifier',
  })
  readonly variantId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Variant name',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message: 'SEO variant name should contains only number and Latin letters',
  })
  @ApiProperty({
    description: 'Variant name that is used for search engine optimization',
  })
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is variant visible for public users',
  })
  readonly isActive: boolean;
}
