import { PickType } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class SignInDto extends PickType(UserDto, ['email', 'password']) {}
