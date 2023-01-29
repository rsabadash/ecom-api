import { ObjectId } from 'mongodb';
import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the category',
  })
  readonly id: ObjectId;
}
