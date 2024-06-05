import { Role } from '../enums/role.enums';
import { Tokens } from './authentication.interface';
import { ObjectId } from 'mongodb';

export interface SignUpResponse {
  _id: ObjectId;
  email: string;
  roles: Role[];
}

export interface SignInResponse extends Tokens {}

export interface RefreshTokenResponse extends Tokens {}
