import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { WarehouseDto } from './warehouse.dto';

export class UpdateWarehouseDto extends PartialType(
  OmitType(WarehouseDto, ['_id'] as const),
) {
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the warehouse',
  })
  readonly id: string;
}
