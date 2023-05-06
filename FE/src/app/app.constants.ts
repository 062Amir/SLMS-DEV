import { environment } from '../environments/environment';

function createUrl(actionName: string): string {
  return `${environment.apiHost}${actionName}`;
}

export const apiResourses = {
  users: createUrl('/Users'),
  leaves: createUrl('/Leaves'),
};

export const appMessages = {
  DEFAULT_ERROR: 'An unexpected error occured, please try again later',
  USER_ALREADY_EXISTS: 'User already exists with this contact number/email/username.',
  INVALID_CREDENTIALS: 'Invalid credentials',
};

export const appDefaults = {
  minAllowedFileSize: 1000000, // 1MB
  pageCount: 10,
};

export const localStorageKeys = {
  loggedInUser: '_lsms_loggedin_user',
};

export const userRoleTypes = {
  HOD: 'hod',
  STAFF: 'staff',
};

export const departmentTypes: string[] = ['HR', 'Training', 'Finance', 'Sales', 'Development'];

export const allowedImageTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

export const leaveStatusTypes = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};
