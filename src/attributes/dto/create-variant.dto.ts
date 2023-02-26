import { ApiProperty, OmitType } from '@nestjs/swagger';
import { VariantDto } from './variant.dto';
import { ObjectId } from 'mongodb';
import { IsMongoId, IsString } from 'class-validator';

export class CreateVariantDto extends OmitType(VariantDto, [
  'variantId',
] as const) {
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the parent attribute',
  })
  readonly attributeId: ObjectId;
}
