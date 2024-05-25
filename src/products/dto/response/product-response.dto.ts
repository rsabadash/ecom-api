import { ApiProperty } from '@nestjs/swagger';
import { Unit } from '../../enums/unit.enum';
import { ProductAttributeResponseDto } from './product-attribute-response.dto';
import {
  ProductAttributeResponse,
  ProductWarehouseResponse,
} from '../../interfaces/response.interface';
import { ProductWarehouseResponseDto } from './product-warehouse-response.dto';

export class ProductResponseDto {
  @ApiProperty({ description: 'Product identifier' })
  readonly _id: string;

  @ApiProperty({ description: 'Product name' })
  readonly name: string;

  @ApiProperty({ description: 'Unique SKU identifier of product' })
  readonly sku: string;

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

  @ApiProperty({
    type: [ProductAttributeResponseDto],
    description: 'Product attributes',
    nullable: true,
    default: [],
  })
  readonly attributes: ProductAttributeResponse[] | null;

  @ApiProperty({ description: 'Product creation date' })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Supply identifiers that is related to product',
    nullable: true,
    default: [],
  })
  readonly supplyIds: string[] | null;

  @ApiProperty({
    type: [ProductWarehouseResponseDto],
    description: 'List of warehouses where the product is located',
    nullable: true,
    default: [],
  })
  readonly warehouses: ProductWarehouseResponse[] | null;

  @ApiProperty({
    description: 'Is product logically deleted',
    default: false,
  })
  readonly isDeleted: boolean;
}
