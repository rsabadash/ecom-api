import { Role } from '../../users/enums/role.enum';

export const MODULE_NAME = 'Auth module';

export const ERROR = {
  SIGN_UP_EMAIL_EXISTS: 'User with the email already exists',
  SIGN_UP_NOT_CREATED: 'User has not been created',
  SIGN_IN_NOT_FOUND: 'User has not been found',
  SIGN_IN_NOT_AUTHORIZED: 'Email or password do not match',
  TOKEN_MALFORMED: 'JWT malformed or invalid options',
};

export const SUCCESS = {
  SIGN_UP: 'User has been signed up',
  SIGN_IN: 'User has been signed in',
  REFRESH_TOKEN: 'User received a new pair of tokens',
};

export const DESCRIPTION = {
  ID: {
    type: 'string',
    description: 'User identifier',
  },
  EMAIL: {
    description: 'User email',
  },
  PASSWORD: {
    description: 'User password',
  },
  ROLES: {
    description: 'User roles',
    enum: Role,
    example: [Role.Admin, Role.ContentManager],
  },
  ACCESS_TOKEN: { description: 'Access token' },
  REFRESH_TOKEN: {
    description: 'Refresh token to sign a new access token',
  },
};
