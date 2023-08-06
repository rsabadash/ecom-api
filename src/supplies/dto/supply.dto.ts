import { ISupplyDto, ISupplyProduct } from '../interfaces/supplies.interfaces';
import {
  ArrayNotEmpty,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DECIMAL_TWO_SIGN } from '../../common/constants/reg-exp.contants';
import { Type } from 'class-transformer';
import { SupplyProductDto } from './supply-product.dto';

export class SupplyDto implements ISupplyDto {
  @IsMongoId()
  @ApiProperty({
    description: 'Supply identifier (returned as ObjectId)',
  })
  readonly _id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Supply name',
    nullable: true,
    default: null,
  })
  readonly name: null | string = null;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SupplyProductDto)
  @ApiProperty({
    type: [SupplyProductDto],
    description: 'List of products in supply',
  })
  readonly products: ISupplyProduct[];

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(DECIMAL_TWO_SIGN), {
    message:
      'Total cost should be integer or decimal with a maximum of two sign',
  })
  @ApiProperty({
    description: 'Total cost of all products in supply',
  })
  readonly productsTotalCost: string;

  @IsMongoId()
  @ApiProperty({
    description: 'Supplier identifier that did the supply',
  })
  readonly supplierId: string;

  @IsMongoId()
  @ApiProperty({
    description: 'Warehouse identifier that initially stored the supply',
  })
  readonly warehouseId: string;

  @IsDate()
  @ApiProperty({
    description: 'Supply creation date',
  })
  readonly createdAt: Date;
}
