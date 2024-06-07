import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateWarehouse } from '../../interface/warehouse.interface';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { WarehouseType } from '../../enums/warehouse-types.enum';

export class UpdateWarehouseDto implements UpdateWarehouse {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ID)
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.NAME)
  readonly name: string;

  @IsEnum(WarehouseType)
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.TYPE)
  readonly type: WarehouseType;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @ApiPropertyOptional(DESCRIPTION.ADDRESS)
  readonly address: string | null = null;
}