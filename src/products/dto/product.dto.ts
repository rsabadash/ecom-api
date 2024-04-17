import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import {
  IProductAttribute,
  IProductDto,
  IProductWarehouses,
} from '../interfaces/products.interfaces';
import { Unit } from '../enums/unit.enums';
import { ProductWarehousesDto } from './product-warehouses.dto';
import { AttributeProductDto } from './attribute-product.dto';

export class ProductDto implements IProductDto {
  @IsMongoId()
  @ApiProperty({
    description: 'Product identifier (returned as ObjectId)',
  })
  readonly _id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product name',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'A unique SKU identifier of product',
  })
  readonly sku: string;

  @IsEnum(Unit)
  @ApiProperty({
    description: 'Product measurement unit',
    enum: Unit,
    example: [
      Unit.Meter,
      Unit.Centimetre,
      Unit.Millimetre,
      Unit.Liter,
      Unit.Milliliter,
      Unit.Kilogram,
      Unit.Gram,
      Unit.Milligram,
      Unit.Item,
    ],
  })
  readonly unit: Unit;

  @ValidateNested({ each: true })
  @Type(() => AttributeProductDto)
  @ApiProperty({
    type: [AttributeProductDto],
    description: 'Attributes for product',
    nullable: true,
    default: [],
  })
  readonly attributes: IProductAttribute[] = [];

  @IsDate()
  @ApiProperty({
    description: 'Product creation date',
  })
  readonly createdAt: Date;

  @IsMongoId({ each: true })
  @ApiProperty({
    description: 'Supply identifiers that is related to product',
    nullable: true,
    default: [],
  })
  readonly supplyIds: string[] = [];

  @ValidateNested({ each: true })
  @Type(() => ProductWarehousesDto)
  @ApiProperty({
    description: 'List of to which product belongs',
    nullable: true,
    default: [],
  })
  readonly warehouses: IProductWarehouses[] = [];

  @IsBoolean()
  @ApiProperty({
    description: 'Define is product logically deleted',
    default: false,
  })
  readonly isDeleted: boolean = false;
}
