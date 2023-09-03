import { ObjectId } from 'mongodb';
import { Role } from '../../iam/enums/role.enums';

export interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  roles: Role[];
}

export interface IUserCreate
  extends Pick<IUser, 'email' | 'password' | 'roles'> {}

export interface IUserUpdate
  extends Partial<Pick<IUser, 'email' | 'password' | 'roles'>> {
  id: string;
}

export interface IUserPublic extends Omit<IUser, 'password'> {}

export interface GetUserParameters {
  userId: string;
}
