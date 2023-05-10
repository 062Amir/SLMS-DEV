import { environment } from '../environments/environment';

function createUrl(actionName: string): string {
  return `${environment.apiHost}${actionName}`;
}

export const apiResourses = {
  login: createUrl('/auth/login'),
  register: createUrl('/auth/register'),
  department: createUrl('/departments'),
  users: createUrl('/Users'),
  leaves: createUrl('/Leaves'),
};

export enum AppMessages {
  DEFAULT_ERROR = 'An unexpected error occured, please try again later',
  USER_ALREADY_EXISTS = 'User already exists with this contact number/email/username.',
  INVALID_CREDENTIALS = 'Invalid credentials',
}

export enum AppDefaults {
  MIN_ALLOWED_FILE_SIZE = 1000000, // 1MB
  PAGE_COUNT = 10,
}

export enum LocalStorageKeys {
  LOGGED_IN_USER = '_slms_loggedin_user',
  TOKEN = '_slms_token',
}

export enum UserRoles {
  ADMIN = 'ADMIN',
  HOD = 'HOD',
  STAFF = 'STAFF',
}

export const allowedImageTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

export enum leaveStatusTypes {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}
