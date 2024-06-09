import { UserEntity } from './user.interface';

export interface UserEntityResponse extends UserEntity {}

interface UserEntityCommonResponse
  extends Pick<UserEntityResponse, '_id' | 'email' | 'roles'> {}

export interface GetUsersResponse extends UserEntityCommonResponse {}

export interface GetUserResponse extends UserEntityCommonResponse {}

export interface CreateUserResponse extends UserEntityCommonResponse {}
