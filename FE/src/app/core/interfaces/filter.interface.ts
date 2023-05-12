import { LeaveStatus } from 'src/app/app.constants';

interface CommonFiltes {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  sortBy?: 'asc' | 'desc';
}

export interface IDepartmentFilters extends CommonFiltes {}

export interface ILeaveFilters extends CommonFiltes {
  reason_like?: string;
  status?: `${LeaveStatus}`;
  user?: string;
  department?: string;
  fromDate?: any;
  toDate?: any;
}

export interface IUserFilters extends CommonFiltes {
  department?: string;
  status?: string;
}
