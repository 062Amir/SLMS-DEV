import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';
import { AppDefaults, SortBy, UserStatus } from 'src/app/app.constants';
import { ISortChange, ISortOptions } from 'src/app/core/interfaces/common.interface';
import { IDepartment } from 'src/app/core/interfaces/department.interface';
import { IUserFilters } from 'src/app/core/interfaces/filter.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { UserService } from 'src/app/core/services/user.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  userData: { total: number; data: IUser[] };
  departmentData: { total: number; data: IDepartment[] };
  filters: IUserFilters;
  pageNumber: number;
  filterForm: FormGroup;
  sort: ISortChange;
  subscriptions: Subscription;

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
      label: 'Department',
      value: 'department',
    },
    {
      label: 'Status',
      value: 'status',
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
    return AppDefaults.PAGE_COUNT as number;
  }

  get userStatusOptions() {
    return Object.values(UserStatus);
  }

  get UserStatus() {
    return UserStatus;
  }

  constructor(
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private userSvc: UserService,
    private authSvc: AuthService,
    private formBuilder: FormBuilder,
    private departmentSvc: DepartmentService
  ) {}

  ngOnInit(): void {
    this.userData = {
      total: 0,
      data: [],
    };
    this.departmentData = {
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

    this.filterForm = this.formBuilder.group({
      search: ['', []],
      department: ['', []],
      status: ['', []],
    });

    this.loadDepartments();
    this.applyFilters();
  }

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe((formData: any) => {
        this.applyFilters();
      })
    );
  }

  async loadDepartments(): Promise<void> {
    try {
      this.utilSvc.showSpinner();
      this.departmentData = await this.departmentSvc.getDepartments();
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
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
    if (formData.department) {
      this.filters.department = formData.department;
    }
    if (formData.status) {
      this.filters.status = formData.status;
    }

    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      this.utilSvc.showSpinner();
      this.userData = await this.userSvc.getUsers(this.filters);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  onPageChange(): void {
    this.filters.page = this.pageNumber;
    this.loadUsers();
  }

  onSortChange(sort: ISortChange) {
    this.sort = sort;
    this.filters.sort = sort.sort;
    this.filters.sortBy = sort.sortBy;
    this.loadUsers();
  }

  async updateUserStatus(user: IUser, status: `${UserStatus}`) {
    try {
      const msg = `Are you sure to ${status === UserStatus.ACTIVE ? 'activate' : 'deactivate'} this user?`;
      const result = await this.utilSvc.showConfirmation(msg);
      if (result) {
        this.utilSvc.showSpinner();
        const action = status === UserStatus.ACTIVE ? 'activate' : 'deactivate';
        await this.userSvc.updateUserStatus(user._id, action);
        this.notifySvc.success('User status updated successfully');
        await this.loadUsers();
      }
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  async deleteUser(user: IUser) {
    try {
      const result = await this.utilSvc.showConfirmation('Are you sure to delete this user?');
      if (result) {
        this.utilSvc.showSpinner();
        await this.userSvc.deleteUser(user._id);
        this.notifySvc.success('User deleted successfully.');
        await this.loadUsers();
      }
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  getUrl = (action: string, user?: IUser): string => {
    switch (action) {
      case 'add':
        return '/hods/new';
      case 'details':
        return `/hods/${user?._id}`;
      default:
        return '/hods';
    }
  };

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
