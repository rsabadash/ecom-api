import {
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ISupplyProduct } from '../interfaces/supplies.interfaces';
import { DECIMAL_TWO_SIGN } from '../../common/constants/reg-exp.contants';
import { Type } from 'class-transformer';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';

export class SupplyProductDto implements ISupplyProduct {
  @IsMongoId()
  @ApiProperty({
    description: 'Product identifier',
  })
  readonly productId: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Product translations',
  })
  readonly productName: Translations;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(DECIMAL_TWO_SIGN), {
    message:
      'Quantity of product should be integer or decimal with a maximum of two sign',
  })
  @ApiProperty({
    description: 'Quantity of product in supply',
  })
  readonly quantity: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(DECIMAL_TWO_SIGN), {
    message:
      'Price of product should be integer or decimal with a maximum of two sign',
  })
  @ApiProperty({
    description: 'Price of product in supply',
  })
  readonly price: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(DECIMAL_TWO_SIGN), {
    message:
      'Total cost of product should be integer or decimal with a maximum of two sign',
  })
  @ApiProperty({
    description: 'Total cost of product in supply',
  })
  readonly totalCost: string;

  @IsMongoId({ each: true })
  @ApiProperty({
    description: 'Attribute identifiers that are related to product',
    nullable: true,
    default: [],
  })
  readonly attributeIds: string[] = [];

  @IsMongoId({ each: true })
  @ApiProperty({
    description: 'Variant identifiers that are related to product',
    nullable: true,
    default: [],
  })
  readonly variantIds: string[] = [];
}
