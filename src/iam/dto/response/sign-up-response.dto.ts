import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../enums/role.enums';
import { SignUpResponse } from '../../interfaces/response.interface';

export class SignUpResponseDto implements SignUpResponse {
  @ApiProperty({
    description: 'User identifier (returned as ObjectId)',
  })
  readonly _id: string;

  @ApiProperty({ description: 'User email' })
  readonly email: string;

  @ApiProperty({
    description: 'User roles',
    enum: Role,
    isArray: true,
    example: [Role.Admin, Role.ContentManager],
  })
  readonly roles: Role[];
}
