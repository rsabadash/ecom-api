import { ObjectId } from 'mongodb';
import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAttributeDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the attribute',
  })
  readonly id: ObjectId;
}
