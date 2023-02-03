import { ObjectId } from 'mongodb';
import { IsMongoId } from 'class-validator';

export class DeleteAttributeVariantDto {
  @IsMongoId()
  readonly attributeId: ObjectId;

  @IsMongoId()
  readonly variantId: ObjectId;
}
