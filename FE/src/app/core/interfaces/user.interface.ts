import { IUserCredentials } from './credentials.interface';
import { IDepartment } from './department.interface';

export interface IUser extends IUserCredentials {
  _id: string;
  department: IDepartment;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
