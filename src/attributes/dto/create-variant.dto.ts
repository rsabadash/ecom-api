import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { IsMongoId } from 'class-validator';
import { VariantDto } from './variant.dto';

export class CreateVariantDto extends OmitType(VariantDto, [
  'variantId',
] as const) {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the parent attribute',
  })
  readonly attributeId: ObjectId;
}
