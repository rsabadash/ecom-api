import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../enums/role.enums';
import { SignUpResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { ObjectId } from 'mongodb';

export class SignUpResponseDto implements SignUpResponse {
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: ObjectId;

  @ApiProperty(DESCRIPTION.EMAIL)
  readonly email: string;

  @ApiProperty(DESCRIPTION.ROLES)
  readonly roles: Role[];
}
