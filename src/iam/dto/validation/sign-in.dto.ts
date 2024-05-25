import { IsEmail, IsString } from 'class-validator';
import { SignIn } from '../../interfaces/authentication.interface';

export class SignInDto implements SignIn {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
