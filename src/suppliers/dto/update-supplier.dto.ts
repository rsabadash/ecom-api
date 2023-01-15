import { SupplierDto } from './supplier.dto';
import { IsMongoObjectId } from '../../common/decorators/is-mongo-objectId.decorator';
import { ObjectId } from 'mongodb';

export class UpdateSupplierDto extends SupplierDto {
  @IsMongoObjectId()
  readonly id: ObjectId;
}
