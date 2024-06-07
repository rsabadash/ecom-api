import { Role } from '../enums/role.enum';

export const MODULE_NAME = 'Users module';

export const ERROR = {
  USER_NOT_FOUND: 'User has not been found',
  EMAIL_EXISTS: 'User with the email already exists',
  USER_NOT_CREATED: 'User has not been created',
  USER_NOT_UPDATED: 'User has not been updated',
};

export const SUCCESS = {
  GET_USERS: 'List of users',
  GET_USER_VERIFICATION: 'User data',
  GET_USER: 'User data',
  CREATE_USER: 'User created',
  UPDATE_USER: 'User has been updated',
};

export const DESCRIPTION = {
  ID: {
    type: 'string',
    description: 'User identifier',
  },
  EMAIL: { description: 'User email' },
  PASSWORD: { description: 'User account password' },
  ROLES: {
    type: [],
    description: 'User roles',
    enum: Role,
    example: [Role.Admin, Role.ContentManager],
  },
};
