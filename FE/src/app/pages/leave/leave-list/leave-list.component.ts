import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { appDefaults, leaveStatusTypes, userRoleTypes } from 'src/app/app.constants';
import { ISortChange, ISortOptions } from 'src/app/core/interfaces/common.interface';
import { ILeaveFilters } from 'src/app/core/interfaces/filter.interface';
import { ILeave } from 'src/app/core/interfaces/leave.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LeaveService } from 'src/app/core/services/leave.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css'],
})
export class LeaveListComponent implements OnInit {
  loggedInUser: IUser;
  leaveData: { total: number; data: ILeave[] };
  filters: ILeaveFilters;
  pageNumber: number;
  filterForm: FormGroup;
  sort: ISortChange;

  sortOptions: ISortOptions[] = [
    {
      label: 'From Date',
      value: 'fromDate',
    },
    {
      label: 'To Date',
      value: 'toDate',
    },
    {
      label: 'Reason',
      value: 'reason',
    },
    {
      label: 'Status',
      value: 'status',
    },
    {
      label: 'Applied On',
      value: 'createdAt',
    },
    {
      label: '',
      value: '',
    },
  ];

  get pageCount() {
    return appDefaults.pageCount;
  }

  get leaveStatusTypes() {
    return leaveStatusTypes;
  }

  get leaveStatusOptions() {
    return Object.values(leaveStatusTypes);
  }

  get isUserHod(): boolean {
    return this.loggedInUser.role === userRoleTypes.HOD;
  }

  constructor(
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private leaveSvc: LeaveService,
    private authSvc: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authSvc.getLoggedInUser() as IUser;
    this.leaveData = {
      total: 0,
      data: [],
    };
    this.filters = {};
    this.sort = {
      sortBy: 'createdAt',
      order: 'desc',
    };
    this.pageNumber = 1;
    if (this.isUserHod) {
      this.sortOptions.unshift({ label: 'User', value: '' });
    }

    this.filterForm = this.formBuilder.group({
      search: ['', []],
      status: ['', []],
    });

    this.applyFilters();
  }

  applyFilters(): void {
    this.filters = {};
    this.pageNumber = 1;
    this.filters._page = this.pageNumber;
    this.filters._limit = appDefaults.pageCount;
    this.filters._sort = this.sort.sortBy;
    this.filters._order = this.sort.order;
    if (this.loggedInUser.role === userRoleTypes.STAFF) {
      this.filters.userId = this.loggedInUser.userId;
    } else {
      this.filters.department = this.loggedInUser.department;
    }

    const formData: any = this.filterForm.value;
    if (formData.search) {
      this.filters.reason_like = formData.search;
    }
    if (formData.status) {
      this.filters.status = formData.status;
    }

    this.loadLeaves();
  }

  async loadLeaves(): Promise<void> {
    try {
      this.utilSvc.showSpinner();
      this.leaveData = await this.leaveSvc.getLeaves(this.filters);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  onPageChange(): void {
    this.filters._page = this.pageNumber;
    this.loadLeaves();
  }

  onSortChange(sort: ISortChange) {
    this.sort = sort;
    this.filters._sort = sort.sortBy;
    this.filters._order = sort.order;
    this.loadLeaves();
  }

  resetFilters() {
    this.filterForm.reset();
    this.applyFilters();
  }

  async updateLeaveStatus(leave: ILeave, status: string) {
    try {
      const msg = `Are you sure to ${status === leaveStatusTypes.APPROVED ? 'approve' : 'reject'} this leave?`;
      const result = await this.utilSvc.showConfirmation(msg);
      if (result) {
        this.utilSvc.showSpinner();
        await this.leaveSvc.updateLeave(leave.id as number, { status });
        this.notifySvc.success('Leave updated successfully');
        this.loadLeaves();
      }
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
