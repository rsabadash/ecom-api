import { ApiProperty } from '@nestjs/swagger';
import { Unit } from '../../enums/unit.enum';
import { ProductAttributeResponseDto } from './product-attribute-response.dto';
import {
  ProductAttributeResponse,
  ProductWarehouseResponse,
} from '../../interfaces/response.interface';
import { ProductWarehouseResponseDto } from './product-warehouse-response.dto';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class ProductResponseDto {
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: string;

  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string;

  @ApiProperty(DESCRIPTION.SKU)
  readonly sku: string;

  @ApiProperty(DESCRIPTION.UNIT)
  readonly unit: Unit;

  @ApiProperty({
    ...DESCRIPTION.ATTRIBUTES,
    type: [ProductAttributeResponseDto],
  })
  readonly attributes: ProductAttributeResponse[] | null;

  @ApiProperty(DESCRIPTION.CREATED_AT)
  readonly createdAt: Date;

  @ApiProperty(DESCRIPTION.SUPPLY_IDS)
  readonly supplyIds: string[] | null;

  @ApiProperty({
    ...DESCRIPTION.WAREHOUSES,
    type: [ProductWarehouseResponseDto],
  })
  readonly warehouses: ProductWarehouseResponse[] | null;

  @ApiProperty(DESCRIPTION.IS_DELETED)
  readonly isDeleted: boolean;
}
