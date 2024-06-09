import { Role } from '../../users/enums/role.enum';
import { UserEntity } from '../../users/interfaces/user.interface';

export interface SignUp {
  email: string;
  password: string;
  roles: Role[];
}

export interface SignIn {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshToken extends Pick<Tokens, 'refreshToken'> {}

export interface JwtDecoded {
  sub: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface UserData extends Omit<UserEntity, 'password'> {}
