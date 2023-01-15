import { IsMongoObjectId } from '../../common/decorators/is-mongo-objectId.decorator';
import { ObjectId } from 'mongodb';

export class DeleteSupplierDto {
  @IsMongoObjectId()
  readonly id: ObjectId;
}
