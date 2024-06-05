import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SignIn } from '../../interfaces/authentication.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class SignInDto implements SignIn {
  @IsEmail()
  @ApiProperty(DESCRIPTION.EMAIL)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.PASSWORD)
  readonly password: string;
}
