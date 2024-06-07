import { ApiProperty } from '@nestjs/swagger';
import { WarehouseCreate } from '../../interface/warehouses.interface';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { WarehouseType } from '../../enums/warehouse-types';

export class CreateWarehouseDto implements WarehouseCreate {
  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string;

  @IsEnum(WarehouseType)
  @ApiProperty(DESCRIPTION.TYPE)
  readonly type: WarehouseType;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== null)
  @ApiProperty(DESCRIPTION.ADDRESS)
  readonly address: string | null = null;
}
