import {
  ArrayNotEmpty,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  CreateSupply,
  CreateSupplyProduct,
} from '../../interfaces/supplies.interfaces';
import { DECIMAL_TWO_SIGN } from '../../../common/constants/reg-exp.contants';
import {
  DESCRIPTION,
  VALIDATION_MESSAGE,
} from '../../constants/swagger.constants';
import { CreateSupplyProductDto } from './create-supply-product.dto';

export class CreateSupplyDto implements CreateSupply {
  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== null)
  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string | null = null;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(DECIMAL_TWO_SIGN), {
    message: VALIDATION_MESSAGE.PRODUCTS_TOTAL_COST,
  })
  @ApiProperty(DESCRIPTION.PRODUCTS_TOTAL_COST)
  readonly productsTotalCost: string;

  @IsMongoId()
  @ApiProperty(DESCRIPTION.SUPPLIER_ID)
  readonly supplierId: string;

  @IsMongoId()
  @ApiProperty(DESCRIPTION.WAREHOUSE_ID)
  readonly warehouseId: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSupplyProductDto)
  @ApiProperty({
    ...DESCRIPTION.PRODUCTS,
    type: [CreateSupplyProductDto],
  })
  readonly products: CreateSupplyProduct[];
}
