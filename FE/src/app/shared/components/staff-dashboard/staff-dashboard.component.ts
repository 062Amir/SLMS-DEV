import { Component, OnInit } from '@angular/core';
import { leaveStatusTypes, userRoleTypes } from 'src/app/app.constants';
import { ISortOptions } from 'src/app/core/interfaces/common.interface';
import { ILeaveFilters } from 'src/app/core/interfaces/filter.interface';
import { ILeave } from 'src/app/core/interfaces/leave.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LeaveService } from 'src/app/core/services/leave.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css'],
})
export class StaffDashboardComponent implements OnInit {
  loggedInUser: IUser;
  leaveData: { total: number; data: ILeave[] };
  filters: ILeaveFilters;
  counts: { applied: number; approved: number; rejected: number };

  sortOptions: ISortOptions[] = [
    {
      label: 'From Date',
      value: '',
    },
    {
      label: 'To Date',
      value: '',
    },
    {
      label: 'Reason',
      value: '',
    },
    {
      label: 'Status',
      value: '',
    },
    {
      label: 'Applied On',
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
    private leaveSvc: LeaveService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authSvc.getLoggedInUser() as IUser;
    this.leaveData = {
      total: 0,
      data: [],
    };
    this.filters = {
      _sort: 'createdAt',
      _order: 'desc',
    };
    this.counts = { applied: 0, approved: 0, rejected: 0 };

    this.initData();
  }

  initData() {
    this.loadCounts();
    this.loadLeaves();
  }

  async loadCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('count-spinner');
      this.counts = await this.leaveSvc.getLeavesCount({
        userId: this.loggedInUser.userId,
      });
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('count-spinner');
    }
  }

  async loadLeaves(): Promise<void> {
    try {
      this.utilSvc.showSpinner('leaves-spinner');
      this.filters._page = 1;
      this.filters._limit = 5;
      if (this.loggedInUser.role === userRoleTypes.STAFF) {
        this.filters.userId = this.loggedInUser.userId;
      }
      this.leaveData = await this.leaveSvc.getLeaves(this.filters);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('leaves-spinner');
    }
  }
}
