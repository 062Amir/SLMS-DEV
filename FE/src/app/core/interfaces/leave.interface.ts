import { LeaveStatus } from 'src/app/app.constants';
import { IUser } from './user.interface';
import { IDepartment } from './department.interface';

export interface ILeave {
  _id: string;
  fromDate: Date | string;
  toDate: Date | string;
  reason: string;
  status: `${LeaveStatus}`;
  user: IUser;
  department: IDepartment;
  createdAt: Date | string;
  updatedAt: Date | string;
}
