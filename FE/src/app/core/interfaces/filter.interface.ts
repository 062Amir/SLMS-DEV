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
  status?: string;
  userId?: string;
  department?: string;
}

export interface IUserFilters extends CommonFiltes {
  department?: string;
  status?: string;
}
