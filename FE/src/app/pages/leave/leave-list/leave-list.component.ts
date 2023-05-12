import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, debounceTime } from 'rxjs';
import { AppDefaults, LeaveStatus, SortBy, UserRoles } from 'src/app/app.constants';
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
export class LeaveListComponent implements OnInit, AfterViewInit, OnDestroy {
  leaveData: { total: number; data: ILeave[] };
  filters: ILeaveFilters;
  pageNumber: number;
  filterForm: FormGroup;
  sort: ISortChange;
  subscriptions: Subscription;

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
    return AppDefaults.PAGE_COUNT as number;
  }

  get LeaveStatus() {
    return LeaveStatus;
  }

  get LeaveStatusOptions() {
    return Object.values(LeaveStatus);
  }

  get isUserHod(): boolean {
    return this.authSvc.getLoggedInUser.role === UserRoles.HOD;
  }

  get isUserStaff(): boolean {
    return this.authSvc.getLoggedInUser.role === UserRoles.STAFF;
  }

  // get fromMinDate(): NgbDateStruct {
  //   return this.utilSvc.getNgbDate(new Date());
  // }

  // get toMinDate(): NgbDateStruct {
  //   return this.filterForm.controls['fromDate'].value || this.utilSvc.getNgbDate(new Date());
  // }

  constructor(
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private leaveSvc: LeaveService,
    private authSvc: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.leaveData = {
      total: 0,
      data: [],
    };
    this.filters = {};
    this.sort = {
      sort: AppDefaults.SORT as string,
      sortBy: SortBy.DESC,
    };
    this.pageNumber = 1;
    this.subscriptions = new Subscription();
    if (this.isUserHod) {
      this.sortOptions.unshift({ label: 'User', value: '' });
    }

    this.filterForm = this.formBuilder.group({
      search: ['', []],
      status: ['', []],
      // fromDate: ['', []],
      // toDate: ['', []],
    });

    this.applyFilters();
  }

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe((formData: any) => {
        this.applyFilters();
      })
    );
  }

  applyFilters(): void {
    this.filters = {};
    this.pageNumber = 1;
    this.filters.page = this.pageNumber;
    this.filters.limit = AppDefaults.PAGE_COUNT;
    this.filters.sort = this.sort.sort;
    this.filters.sortBy = this.sort.sortBy;

    const formData: any = this.filterForm.value;
    if (formData.search) {
      this.filters.q = formData.search;
    }
    if (formData.status) {
      this.filters.status = formData.status;
    }
    // if (formData.fromDate && formData.toDate) {
    //   this.filters.fromDate = this.utilSvc.getFormattedDate(formData.fromDate).toISOString();
    //   this.filters.toDate = this.utilSvc.getFormattedDate(formData.toDate).toISOString();
    // }

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
    this.filters.page = this.pageNumber;
    this.loadLeaves();
  }

  onSortChange(sort: ISortChange) {
    this.sort = sort;
    this.filters.sort = sort.sort;
    this.filters.sortBy = sort.sortBy;
    this.loadLeaves();
  }

  async updateLeaveStatus(leave: ILeave, status: `${LeaveStatus}`) {
    try {
      const msg = `Are you sure to ${status === LeaveStatus.APPROVED ? 'approve' : 'reject'} this leave?`;
      const result = await this.utilSvc.showConfirmation(msg);
      if (result) {
        this.utilSvc.showSpinner();
        await this.leaveSvc.updateLeaveStatus(leave._id, status === LeaveStatus.APPROVED ? 'approve' : 'reject');
        this.notifySvc.success(`Leave ${status === LeaveStatus.APPROVED ? 'approved' : 'rejected'} successfully`);
        await this.loadLeaves();
      }
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  async deleteLeave(leave: ILeave) {
    try {
      const result = await this.utilSvc.showConfirmation('Are you sure to delete this leave?');
      if (result) {
        this.utilSvc.showSpinner();
        await this.leaveSvc.deleteLeave(leave._id);
        this.notifySvc.success('Leave deleted successfully.');
        await this.loadLeaves();
      }
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  editLeave(leave: ILeave) {
    this.router.navigate([`/leaves/${leave._id}/edit`]);
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
