import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IUserCreate } from '../interfaces/users.interfaces';

export class CreateUserDto
  extends PickType(UserDto, ['email', 'password', 'roles'] as const)
  implements IUserCreate {}
