import { UserRoles, UserStatus } from "../data/app.constants";

export interface IUser {
  _id?: number | string;
  name: string;
  userName: string;
  email: string;
  contactNumber: string;
  department?: any;
  departmentId: any;
  password: string;
  role: UserRoles.ADMIN | UserRoles.HOD | UserRoles.STAFF;
  profileImage?: string;
  status?: `${UserStatus}`;
  createdAt: Date;
  updatedAt: Date;
}
