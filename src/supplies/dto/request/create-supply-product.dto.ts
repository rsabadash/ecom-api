import { IsMongoId, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSupplyProduct } from '../../interfaces/supplies.interfaces';
import { DECIMAL_TWO_SIGN } from '../../../common/constants/reg-exp.contants';
import {
  DESCRIPTION,
  VALIDATION_MESSAGE,
} from '../../constants/swagger.constants';

export class CreateSupplyProductDto implements CreateSupplyProduct {
  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(DECIMAL_TWO_SIGN), {
    message: VALIDATION_MESSAGE.PRODUCTS_TOTAL_QUANTITY,
  })
  @ApiProperty(DESCRIPTION.QUANTITY)
  readonly quantity: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(DECIMAL_TWO_SIGN), {
    message: VALIDATION_MESSAGE.PRODUCTS_PRICE,
  })
  @ApiProperty(DESCRIPTION.PRICE)
  readonly price: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(DECIMAL_TWO_SIGN), {
    message: VALIDATION_MESSAGE.PRODUCT_TOTAL_COST,
  })
  @ApiProperty(DESCRIPTION.TOTAL_COST)
  readonly totalCost: string;

  @IsMongoId()
  @ApiProperty(DESCRIPTION.PRODUCT_ID)
  readonly productId: string;
}
