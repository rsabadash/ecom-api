import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WarehouseType } from '../../enums/warehouse-types';
import { GetWarehouseResponse } from '../../interface/response.interface';
import { ObjectId } from 'mongodb';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class GetWarehouseResponseDto implements GetWarehouseResponse {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: ObjectId;

  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string;

  @IsEnum(WarehouseType)
  @ApiProperty(DESCRIPTION.TYPE)
  readonly type: WarehouseType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.ADDRESS)
  readonly address: string | null;
}
