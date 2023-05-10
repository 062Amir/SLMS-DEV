import { UserRoles } from 'src/app/app.constants';

export interface ILoginCredentials {
  userName: string;
  password: string;
}

export interface IUserCredentials {
  name: string;
  userName: string;
  email: string;
  contactNumber: number | string;
  departmentId: string;
  role: `${UserRoles}`;
  password: string;
  profileImage?: File | string;
}
