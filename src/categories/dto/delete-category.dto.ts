import { ObjectId } from 'mongodb';
import { IsMongoObjectId } from '../../common/decorators/is-mongo-objectId.decorator';

export class DeleteCategoryDto {
  @IsMongoObjectId()
  readonly id: ObjectId;
}
