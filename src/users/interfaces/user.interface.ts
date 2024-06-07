import { ObjectId } from 'mongodb';
import { Role } from '../enums/role.enum';

export interface UserEntity {
  _id: ObjectId;
  email: string;
  password: string;
  roles: Role[];
}

export interface CreateUser {
  email: string;
  password: string;
  roles: Role[];
}

export interface UpdateUser {
  id: string;
  email?: string;
  password?: string;
  roles?: Role[];
}

export interface GetUserParameters {
  userId: string;
}
