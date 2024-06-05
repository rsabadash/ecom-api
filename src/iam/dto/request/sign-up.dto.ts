import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../enums/role.enums';
import { SignUp } from '../../interfaces/authentication.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class SignUpDto implements SignUp {
  @IsEmail()
  @ApiProperty(DESCRIPTION.EMAIL)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.PASSWORD)
  readonly password: string;

  @IsEnum(Role, { each: true })
  @ApiProperty(DESCRIPTION.ROLES)
  readonly roles: Role[];
}
