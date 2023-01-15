import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class DeleteSupplierDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Supplier identifier',
  })
  readonly id: ObjectId;
}
