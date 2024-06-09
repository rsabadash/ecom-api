import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../enums/role.enum';
import { ObjectId } from 'mongodb';
import { CreateUserResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class CreateUserResponseDto implements CreateUserResponse {
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: ObjectId;

  @ApiProperty(DESCRIPTION.EMAIL)
  readonly email: string;

  @ApiProperty(DESCRIPTION.ROLES)
  readonly roles: Role[];
}
