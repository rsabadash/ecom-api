import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { IWarehouse } from '../interfaces/warehouses.interfaces';
import { WarehouseType } from '../enums/warehouse-types';

export class WarehouseDto implements IWarehouse {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Warehouse identifier (returned as ObjectId)',
  })
  readonly _id: ObjectId;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Warehouse name',
  })
  readonly name: string;

  @IsEnum(WarehouseType)
  @ApiProperty({
    description: 'Warehouse type',
    enum: WarehouseType,
    example: [
      WarehouseType.Shop,
      WarehouseType.OnlineStore,
      WarehouseType.Warehouse,
    ],
  })
  readonly type: WarehouseType;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Warehouse address',
    nullable: true,
    default: null,
  })
  readonly address: string | null = null;
}
