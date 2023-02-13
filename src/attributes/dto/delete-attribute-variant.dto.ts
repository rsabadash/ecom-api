import { ObjectId } from 'mongodb';
import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAttributeVariantDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the variant',
  })
  readonly variantId: ObjectId;
}
