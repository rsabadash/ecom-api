import { Role } from '../enums/role.enums';

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
