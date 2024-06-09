import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../enums/role.enum';
import { ObjectId } from 'mongodb';
import { GetUserResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class GetUserResponseDto implements GetUserResponse {
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: ObjectId;

  @ApiProperty(DESCRIPTION.EMAIL)
  readonly email: string;

  @ApiProperty(DESCRIPTION.ROLES)
  readonly roles: Role[];
}
