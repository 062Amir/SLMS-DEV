import { UserStatus } from 'src/app/app.constants';
import { IUserCredentials } from './credentials.interface';
import { IDepartment } from './department.interface';

export interface IUser extends IUserCredentials {
  _id: string;
  department: IDepartment;
  status: `${UserStatus}`;
  createdAt: string;
  updatedAt: string;
}
