import { Component, OnInit } from '@angular/core';
import { AppDefaults, LeaveStatus, SortBy } from 'src/app/app.constants';
// import { leaveStatusTypes, UserRoles } from 'src/app/app.constants';
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
  leaveData: { total: number; data: ILeave[] };
  counts: { applied: number; pending: number; approved: number; rejected: number };

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
    public authSvc: AuthService,
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private leaveSvc: LeaveService
  ) {}

  ngOnInit(): void {
    this.leaveData = {
      total: 0,
      data: [],
    };
    this.counts = { applied: 0, pending: 0, approved: 0, rejected: 0 };

    this.initData();
  }

  initData() {
    this.loadAppliedLeaveCounts();
    this.loadPendingLeaveCounts();
    this.loadApprovedLeaveCounts();
    this.loadRejectedLeaveCounts();
    this.loadLeaves();
  }

  async loadAppliedLeaveCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('applied-leave-count-spinner');
      this.counts.applied = await this.leaveSvc.getLeaveCount();
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('applied-leave-count-spinner');
    }
  }

  async loadPendingLeaveCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('pending-leave-count-spinner');
      this.counts.pending = await this.leaveSvc.getLeaveCount({
        status: LeaveStatus.PENDING,
      });
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('pending-leave-count-spinner');
    }
  }

  async loadApprovedLeaveCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('approved-leave-count-spinner');
      this.counts.applied = await this.leaveSvc.getLeaveCount({
        status: LeaveStatus.APPROVED,
      });
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('approved-leave-count-spinner');
    }
  }

  async loadRejectedLeaveCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('rejected-leave-count-spinner');
      this.counts.applied = await this.leaveSvc.getLeaveCount({
        status: LeaveStatus.REJECTED,
      });
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('rejected-leave-count-spinner');
    }
  }

  async loadLeaves(): Promise<void> {
    try {
      this.utilSvc.showSpinner('leaves-spinner');
      const filters: ILeaveFilters = {
        page: 1,
        limit: 5,
        sort: AppDefaults.SORT as string,
        sortBy: SortBy.DESC,
      };
      this.leaveData = await this.leaveSvc.getLeaves(filters);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('leaves-spinner');
    }
  }
}
