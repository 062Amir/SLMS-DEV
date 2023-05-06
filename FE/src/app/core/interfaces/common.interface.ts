export interface IListResponse {
  total: number;
  data: any[];
}

export interface ISortOptions {
  label: string;
  value: string;
}

export interface ISortChange {
  sortBy: string;
  order: 'asc' | 'desc';
}
