import { ObjectId } from 'mongodb';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enums';
import { IUser } from '../interfaces/users.interfaces';

export class UserDto implements IUser {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the user',
  })
  readonly _id: ObjectId;

  @IsEmail()
  @ApiProperty({ description: 'Email of the user' })
  readonly email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ description: 'Password of the user' })
  readonly password: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  @ApiProperty({
    description: 'Roles of the user',
    enum: Role,
    isArray: true,
    example: [Role.Admin, Role.ContentManager],
  })
  readonly roles: Role[];
}
