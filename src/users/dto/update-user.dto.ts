import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(OmitType(UserDto, ['_id'])) {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: "User's identifier",
  })
  readonly id: ObjectId;
}
