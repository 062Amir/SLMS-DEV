import { IUser } from './user.interface';

export interface ILeave {
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  leaveId: string;
  createdAt: string;
  userId: string;
  id?: number;
  user: IUser;
  department: string;
}
