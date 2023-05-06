export interface ILoginCredentials {
  userName: string;
  password: string;
}

export interface IUserCredentials {
  name: string;
  userName: string;
  email: string;
  contactNumber: number;
  department: string;
  role: string;
  password: string;
  profileImage?: string;
  userId: string;
  createdAt: string;
}
