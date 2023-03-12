import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['_id'] as const),
) {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the user',
  })
  readonly id: ObjectId;
}
