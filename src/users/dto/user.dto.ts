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

export class UserDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: "User's identifier",
  })
  readonly _id: ObjectId;

  @IsEmail()
  @ApiProperty({ description: "User's email" })
  readonly email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ description: "User's password" })
  readonly password: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  @ApiProperty({
    description: "User's role",
    enum: Role,
    isArray: true,
    example: [Role.Admin, Role.ContentManager],
  })
  readonly roles: Role[];
}
