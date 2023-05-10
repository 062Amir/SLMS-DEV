import { IUserCredentials } from './credentials.interface';

export interface IUser extends IUserCredentials {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
