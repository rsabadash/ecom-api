import { Role } from '../enums/role.enums';
import { Tokens } from './authentication.interface';

export interface SignUpResponse {
  _id: string;
  email: string;
  roles: Role[];
}

export interface SignInResponse extends Tokens {}

export interface RefreshTokenResponse extends Tokens {}
