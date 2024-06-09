import { ApiProperty } from '@nestjs/swagger';
import { CreateWarehouse } from '../../interface/warehouse.interface';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { WarehouseType } from '../../enums/warehouse-types.enum';

export class CreateWarehouseDto implements CreateWarehouse {
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
