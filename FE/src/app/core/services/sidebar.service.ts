import { Injectable } from '@angular/core';
import { UserRoles } from 'src/app/app.constants';
import { ISidebardItem } from '../interfaces/sidebar-item.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class SidebarService {
  isSidebarOpen: boolean;

  sidebarItems: ISidebardItem[] = [
    {
      text: 'Dashboard',
      path: '/dashboard',
      roles: [UserRoles.ADMIN, UserRoles.HOD, UserRoles.STAFF],
    },
    {
      text: 'Departments',
      path: '/departments',
      roles: [UserRoles.ADMIN],
    },
    {
      text: "Hod's",
      path: '/hods',
      roles: [UserRoles.ADMIN],
    },
    {
      text: 'Staff',
      path: '/staff',
      roles: [UserRoles.HOD],
    },
    {
      text: 'Leaves',
      path: '/leaves',
      roles: [UserRoles.HOD, UserRoles.STAFF],
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
