import { ObjectId } from 'mongodb';
import { Role } from '../enums/role.enums';

export interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  roles: Role[];
}

export interface IUserCreate
  extends Pick<IUser, 'email' | 'password' | 'roles'> {}

export interface IUpdateUser extends Partial<Omit<IUser, '_id'>> {
  id: string;
}

export interface IUserPublic extends Omit<IUser, 'password'> {}

export interface GetUserParameters {
  userId: ObjectId;
}
