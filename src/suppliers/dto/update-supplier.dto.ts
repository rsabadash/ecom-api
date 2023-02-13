import { ObjectId } from 'mongodb';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { SupplierDto } from './supplier.dto';

export class UpdateSupplierDto extends PartialType(
  OmitType(SupplierDto, ['_id'] as const),
) {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the supplier',
  })
  readonly id: ObjectId;
}
