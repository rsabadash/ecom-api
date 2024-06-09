import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../enums/role.enum';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { CreateUser } from '../../interfaces/user.interface';

export class CreateUserDto implements CreateUser {
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
