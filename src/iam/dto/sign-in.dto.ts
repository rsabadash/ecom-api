import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

export class SignInDto extends PickType(UserDto, ['email']) {
  @IsString()
  @ApiProperty({ description: "User's password" })
  readonly password: string;
}
