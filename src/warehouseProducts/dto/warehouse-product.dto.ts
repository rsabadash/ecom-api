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
  IWarehouseProductAttribute,
  IWarehouseProductDto,
  IWarehouseProductWarehouses,
} from '../interfaces/warehouse-products.interfaces';
import { Unit } from '../enums/unit.enums';
import { WarehouseProductWarehousesDto } from './warehouse-product-warehouses.dto';
import { AttributeWarehouseProductDto } from './attribute-warehouse-product.dto';

export class WarehouseProductDto implements IWarehouseProductDto {
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
    description: 'A unique SKU identifier of warehouse product',
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
  @ApiProperty({
    type: [AttributeWarehouseProductDto],
    description: 'Attributes for warehouse product',
    nullable: true,
    default: [],
  })
  readonly attributes: IWarehouseProductAttribute[] = [];

  @IsDate()
  @ApiProperty({
    description: 'Warehouse product creation date',
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
  @Type(() => WarehouseProductWarehousesDto)
  @ApiProperty({
    description: 'List of warehouses to which product belongs',
    nullable: true,
    default: [],
  })
  readonly warehouses: IWarehouseProductWarehouses[] = [];

  @IsBoolean()
  @ApiProperty({
    description: 'Define is product logically deleted',
    default: false,
  })
  readonly isDeleted: boolean = false;
}
