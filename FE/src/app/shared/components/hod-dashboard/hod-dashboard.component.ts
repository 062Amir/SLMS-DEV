import { Component, OnInit } from '@angular/core';
import { userRoleTypes } from 'src/app/app.constants';
import { ISortOptions } from 'src/app/core/interfaces/common.interface';
import { IStaffFilters } from 'src/app/core/interfaces/filter.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StaffService } from 'src/app/core/services/staff.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-hod-dashboard',
  templateUrl: './hod-dashboard.component.html',
  styleUrls: ['./hod-dashboard.component.css'],
})
export class HodDashboardComponent implements OnInit {
  loggedInUser: IUser;
  staffData: { total: number; data: IUser[] };
  filters: IStaffFilters;
  staffCount: number;

  sortOptions: ISortOptions[] = [
    {
      label: '',
      value: '',
    },
    {
      label: 'Name',
      value: '',
    },
    {
      label: 'Email',
      value: '',
    },
    {
      label: 'Contact No.',
      value: '',
    },
    {
      label: 'Username',
      value: '',
    },
    {
      label: 'Added On',
      value: '',
    },
    {
      label: '',
      value: '',
    },
  ];

  constructor(
    private authSvc: AuthService,
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private staffSvc: StaffService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authSvc.getLoggedInUser() as IUser;
    this.staffData = {
      total: 0,
      data: [],
    };
    this.filters = {
      _sort: 'createdAt',
      _order: 'desc',
    };
    this.staffCount = 0;

    this.initData();
  }

  initData() {
    this.loadCounts();
    this.loadStaffs();
  }

  async loadCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('count-spinner');
      this.staffCount = await this.staffSvc.getStaffsCount({
        department: this.loggedInUser.department,
        role: userRoleTypes.STAFF,
      });
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('count-spinner');
    }
  }

  async loadStaffs(): Promise<void> {
    try {
      this.utilSvc.showSpinner('staff-spinner');
      this.filters._page = 1;
      this.filters._limit = 5;
      this.filters.department = this.loggedInUser.department;
      this.filters.role = userRoleTypes.STAFF;
      this.staffData = await this.staffSvc.getStaffs(this.filters);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('staff-spinner');
    }
  }
}
