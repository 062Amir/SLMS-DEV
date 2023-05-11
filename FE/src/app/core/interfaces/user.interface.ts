import { UserRoles, UserStatus } from 'src/app/app.constants';
import { IDepartment } from './department.interface';

export interface IUser {
  _id: string;
  name: string;
  userName: string;
  email: string;
  contactNumber: number | string;
  role: `${UserRoles}`;
  password: string;
  profileImage?: string;
  status: `${UserStatus}`;
  department: IDepartment;
  createdAt: string;
  updatedAt: string;
}
