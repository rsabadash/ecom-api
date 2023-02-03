import { ObjectId } from 'mongodb';
import { IsMongoId } from 'class-validator';

export class GetAttributeVariantDto {
  @IsMongoId()
  readonly attributeId: ObjectId;

  @IsMongoId()
  readonly variantId: ObjectId;
}
