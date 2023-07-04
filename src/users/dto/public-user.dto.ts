import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IUserPublic } from '../interfaces/users.interfaces';

export class PublicUserDto
  extends OmitType(UserDto, ['password'] as const)
  implements Omit<IUserPublic, '_id'> {}
