import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IWarehouse } from '../interfaces/warehouses.interfaces';
import { WarehouseType } from '../enums/warehouse-types';

export class WarehouseDto implements Omit<IWarehouse, '_id'> {
  @IsMongoId()
  @ApiProperty({
    description: 'Warehouse identifier (returned as ObjectId)',
  })
  readonly _id: string;

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
  @ApiProperty({
    description: 'Warehouse address',
    nullable: true,
    default: null,
  })
  readonly address: string | null = null;
}
