import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

export class SignInDto extends PickType(UserDto, ['email'] as const) {
  @IsString()
  @ApiProperty({ description: 'Password of the user' })
  readonly password: string;
}
