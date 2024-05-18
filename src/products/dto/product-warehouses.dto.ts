import { IsMongoId, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IProductWarehouses } from '../interfaces/products.interfaces';
import { DECIMAL_TWO_SIGN } from '../../common/constants/reg-exp.contants';

export class ProductWarehousesDto implements IProductWarehouses {
  @IsMongoId()
  @ApiProperty({
    description: 'Warehouse identifier',
  })
  readonly warehouseId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(DECIMAL_TWO_SIGN), {
    message:
      'Quantity of product should be integer or decimal with a maximum of two sign',
  })
  @ApiProperty({
    type: 'string',
    description: 'Quantity of product in warehouse',
    nullable: true,
    default: null,
  })
  readonly totalQuantity: null | string = null;
}
