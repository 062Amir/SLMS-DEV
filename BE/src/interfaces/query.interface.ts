import { SortOrder } from "mongoose";

export interface IQuery {
  page: number;
  limit: number;
  search: string;
  sort: string;
  sortBy: SortOrder;
}
