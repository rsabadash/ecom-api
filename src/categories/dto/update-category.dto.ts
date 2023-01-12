import { ObjectId } from 'mongodb';
import { PartialType } from '@nestjs/mapped-types';
import { IsMongoObjectId } from '../../common/decorators/is-mongo-objectId.decorator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsMongoObjectId()
  readonly id: ObjectId;
}
