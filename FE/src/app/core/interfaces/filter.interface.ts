interface CommonFiltes {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: 'asc' | 'desc';
}

export interface ILeaveFilters extends CommonFiltes {
  reason_like?: string;
  status?: string;
  userId?: string;
  department?: string;
}

export interface IStaffFilters extends CommonFiltes {
  name_like?: string;
  userName_like?: string;
  email_like?: string;
  contactNumber_like?: string;
  department?: string;
  role?: string;
}
