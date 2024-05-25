import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../enums/role.enums';
import { SignUp } from '../../interfaces/authentication.interface';

export class SignUpDto implements SignUp {
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEnum(Role, { each: true })
  readonly roles: Role[];
}
