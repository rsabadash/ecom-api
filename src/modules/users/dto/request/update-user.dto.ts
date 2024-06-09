import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UpdateUser } from '../../interfaces/user.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { Role } from '../../enums/role.enum';

export class UpdateUserDto implements UpdateUser {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ID)
  readonly id: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.EMAIL)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.PASSWORD)
  readonly password: string;

  @IsEnum(Role, { each: true })
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.ROLES)
  readonly roles: Role[];
}
