import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { appDefaults, userRoleTypes } from 'src/app/app.constants';
import { ISortChange, ISortOptions } from 'src/app/core/interfaces/common.interface';
import { IStaffFilters } from 'src/app/core/interfaces/filter.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StaffService } from 'src/app/core/services/staff.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css'],
})
export class StaffListComponent implements OnInit {
  loggedInUser: IUser;
  staffData: { total: number; data: IUser[] };
  filters: IStaffFilters | any;
  pageNumber: number;
  filterForm: FormGroup;
  sort: ISortChange;

  sortOptions: ISortOptions[] = [
    {
      label: '',
      value: '',
    },
    {
      label: 'Name',
      value: 'name',
    },
    {
      label: 'Email',
      value: 'email',
    },
    {
      label: 'Contact No.',
      value: 'contactNumber',
    },
    {
      label: 'Username',
      value: 'userName',
    },
    {
      label: 'Added On',
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

  constructor(
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private staffSvc: StaffService,
    private authSvc: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authSvc.getLoggedInUser() as IUser;
    this.staffData = {
      total: 0,
      data: [],
    };
    this.filters = {};
    this.sort = {
      sortBy: 'createdAt',
      order: 'desc',
    };
    this.pageNumber = 1;

    this.filterForm = this.formBuilder.group({
      search: ['', []],
      searchFor: ['name_like', []],
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
    this.filters.department = this.loggedInUser.department;
    this.filters.role = userRoleTypes.STAFF;

    const formData: any = this.filterForm.value;
    if (formData.search) {
      this.filters[formData.searchFor] = formData.search;
    }

    this.loadStaffs();
  }

  async loadStaffs(): Promise<void> {
    try {
      this.utilSvc.showSpinner();
      this.staffData = await this.staffSvc.getStaffs(this.filters);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  onPageChange(): void {
    this.filters._page = this.pageNumber;
    this.loadStaffs();
  }

  onSortChange(sort: ISortChange) {
    this.sort = sort;
    this.filters._sort = sort.sortBy;
    this.filters._order = sort.order;
    this.loadStaffs();
  }

  resetFilters() {
    this.filterForm.reset({ searchFor: 'name_like' });
    this.applyFilters();
  }

  async deleteStaffMember(staff: IUser) {
    try {
      const result = await this.utilSvc.showConfirmation('Are you sure to delete this member?');
      if (result) {
        this.utilSvc.showSpinner();
        await this.staffSvc.deleteStaffMember(staff);
        this.notifySvc.success('Staff member deleted successfully.');
        this.loadStaffs();
      }
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
