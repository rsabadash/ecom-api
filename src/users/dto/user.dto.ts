import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../iam/enums/role.enums';
import { IUser } from '../interfaces/users.interfaces';

export class UserDto implements Omit<IUser, '_id'> {
  @IsMongoId()
  @ApiProperty({
    description: 'User identifier (returned as ObjectId)',
  })
  readonly _id: string;

  @IsEmail()
  @ApiProperty({ description: 'User email' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User account password' })
  readonly password: string;

  @IsEnum(Role, { each: true })
  @ApiProperty({
    description: 'User roles',
    enum: Role,
    isArray: true,
    example: [Role.Admin, Role.ContentManager],
  })
  readonly roles: Role[];
}
