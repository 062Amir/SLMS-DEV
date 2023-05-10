import { IUser } from './user.interface';

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface IListResponse {
  total: number;
  data: any[];
}
