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

export class CreateProductDto implements CreateProduct {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly sku: string;

  @IsEnum(Unit)
  readonly unit: Unit;

  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  @ValidateIf((_, value) => value !== null)
  readonly attributes: CreateProductAttribute[] | null = [];
}
