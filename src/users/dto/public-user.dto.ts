import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class PublicUserDto extends OmitType(UserDto, ['password']) {}
