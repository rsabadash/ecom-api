import { ObjectId } from 'mongodb';
import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SupplierDto } from '../../suppliers/dto/supplier.dto';

export class UpdateCategoryDto extends PartialType(
  OmitType(SupplierDto, ['_id'] as const),
) {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the category',
  })
  readonly id: ObjectId;
}
