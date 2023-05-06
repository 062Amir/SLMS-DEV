import { UserRoles } from "../data/app.constants";

export interface IUser {
  id?: number | string;
  name: string;
  userName: string;
  email: string;
  contactNumber: string;
  department?: any;
  departmentId: any;
  password: string;
  role: UserRoles.ADMIN | UserRoles.HOD | UserRoles.STAFF;
  profileImage?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
