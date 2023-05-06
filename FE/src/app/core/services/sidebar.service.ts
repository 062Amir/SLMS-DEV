import { Injectable } from '@angular/core';
import { userRoleTypes } from 'src/app/app.constants';
import { ISidebardItem } from '../interfaces/sidebar-item.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class SidebarService {
  isSidebarOpen: boolean;

  sidebarItems: ISidebardItem[] = [
    {
      text: 'Dashboard',
      path: '/dashboard',
      roles: [userRoleTypes.HOD, userRoleTypes.STAFF],
    },
    {
      text: 'Staff Management',
      path: '/staff',
      roles: [userRoleTypes.HOD],
    },
    {
      text: 'Leaves Management',
      path: '/leaves',
      roles: [userRoleTypes.HOD, userRoleTypes.STAFF],
    },
  ];
  constructor() {
    this.isSidebarOpen = false;
  }

  getSidebarItems(loggedInUser: IUser): ISidebardItem[] {
    if (loggedInUser) {
      return this.sidebarItems.filter((item) => item.roles.includes(loggedInUser.role));
    }
    return [];
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
