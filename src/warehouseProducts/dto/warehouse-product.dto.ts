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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Type } from 'class-transformer';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import {
  IWarehouseProduct,
  IWarehouseProductAttribute,
  IWarehouseProductWarehouses,
} from '../interfaces/warehouse-products.interfaces';
import { Unit } from '../enums/unit.enums';
import { WarehouseProductWarehousesDto } from './warehouse-product-warehouses.dto';
import { AttributeWarehouseProductDto } from './attribute-warehouse-product.dto';

export class WarehouseProductDto implements Omit<IWarehouseProduct, '_id'> {
  @IsMongoId()
  @ApiProperty({
    description: 'Warehouse product identifier (returned as ObjectId)',
  })
  readonly _id: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Warehouse product name translations',
  })
  readonly name: Translations;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'A unique SKU identifier of the warehouse product',
  })
  readonly sku: string;

  @IsEnum(Unit)
  @ApiProperty({
    description: 'Warehouse product measurement unit',
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
  @Type(() => AttributeWarehouseProductDto)
  @ApiPropertyOptional({
    type: [AttributeWarehouseProductDto],
    description: 'Attributes for the warehouse product',
    default: [],
  })
  readonly attributes: IWarehouseProductAttribute[] = [];

  @IsDate()
  @ApiProperty({
    description: 'Warehouse product creation date',
  })
  readonly createdDate: Date;

  @ValidateNested({ each: true })
  @Type(() => ObjectId)
  @ApiPropertyOptional({
    description: 'Identifiers of supplies related to the warehouse product',
    default: [],
  })
  readonly supplyIds: string[] = [];

  @ValidateNested({ each: true })
  @Type(() => WarehouseProductWarehousesDto)
  @ApiPropertyOptional({
    description: 'List of warehouses to which the product belongs',
    default: [],
  })
  readonly warehouses: IWarehouseProductWarehouses[] = [];

  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Define is product logically deleted',
    default: false,
  })
  readonly isDeleted: boolean = false;
}
