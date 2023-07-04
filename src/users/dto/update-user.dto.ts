import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { UserDto } from './user.dto';
import { IUserUpdate } from '../interfaces/users.interfaces';

export class UpdateUserDto
  extends PartialType(OmitType(UserDto, ['_id'] as const))
  implements IUserUpdate
{
  @IsMongoId()
  @ApiProperty({
    description: 'User identifier',
  })
  readonly id: string;
}
