import {
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateProductAttribute,
  CreateProduct,
} from '../../interfaces/products.interfaces';
import { Unit } from '../../enums/unit.enum';
import { CreateProductAttributeDto } from './create-product-attribute.dto';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class CreateProductDto implements CreateProduct {
  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.SKU)
  readonly sku: string;

  @IsEnum(Unit)
  @ApiProperty(DESCRIPTION.UNIT)
  readonly unit: Unit;

  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  @ValidateIf((_, value) => value !== null)
  @ApiProperty(DESCRIPTION.ATTRIBUTES)
  readonly attributes: CreateProductAttribute[] | null = [];
}
