import { ObjectId } from 'mongodb';
import { IsMongoId } from 'class-validator';

export class DeleteAttributeDto {
  @IsMongoId()
  readonly id: ObjectId;
}
