import { IUserCredentials } from './credentials.interface';

export interface IUser extends IUserCredentials {
  id: number;
}
