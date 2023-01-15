import { ObjectId } from 'mongodb';
import { IsMongoId } from 'class-validator';

export class DeleteCategoryDto {
  @IsMongoId()
  readonly id: ObjectId;
}
