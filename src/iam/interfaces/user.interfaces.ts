import { ObjectId } from 'mongodb';
import { Role } from '../enums/role.enum';

export interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  role: Role;
}
