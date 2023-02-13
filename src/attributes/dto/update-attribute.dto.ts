import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import { AttributeDto } from './attribute.dto';

export class UpdateAttributeDto extends PartialType(
  OmitType(AttributeDto, ['_id', 'variants'] as const),
) {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the attribute',
  })
  readonly id: ObjectId;
}
