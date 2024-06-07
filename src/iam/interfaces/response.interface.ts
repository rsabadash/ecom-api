import { Role } from '../../users/enums/role.enum';
import { Tokens } from './authentication.interface';
import { ObjectId } from 'mongodb';

export interface SignUpResponse {
  _id: ObjectId;
  email: string;
  roles: Role[];
}

export interface SignInResponse extends Tokens {}

export interface RefreshTokenResponse extends Tokens {}
