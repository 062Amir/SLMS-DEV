import { Component, OnInit } from '@angular/core';
import { AppDefaults, SortBy, UserStatus } from 'src/app/app.constants';
import { ISortOptions } from 'src/app/core/interfaces/common.interface';
import { IUserFilters } from 'src/app/core/interfaces/filter.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  userData: { total: number; data: IUser[] };
  counts = {
    totalHods: 0,
    activeHods: 0,
    inactiveHods: 0,
  };

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
      label: 'Department',
      value: '',
    },
    {
      label: 'Status',
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
    public authSvc: AuthService,
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private userSvc: UserService
  ) {}

  ngOnInit(): void {
    this.userData = {
      total: 0,
      data: [],
    };

    this.initData();
  }

  initData() {
    this.loadTotalHodsCounts();
    this.loadActiveHodsCounts();
    this.loadInactiveHodsCounts();
    this.loadHods();
  }

  async loadTotalHodsCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('total-hods-count-spinner');
      this.counts.totalHods = await this.userSvc.getUsersCount();
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('total-hods-count-spinner');
    }
  }

  async loadActiveHodsCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('active-hods-count-spinner');
      this.counts.activeHods = await this.userSvc.getUsersCount({
        status: UserStatus.ACTIVE,
      });
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('active-hods-count-spinner');
    }
  }

  async loadInactiveHodsCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('inactive-hods-count-spinner');
      this.counts.inactiveHods = await this.userSvc.getUsersCount({
        status: UserStatus.INACTIVE,
      });
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('inactive-hods-count-spinner');
    }
  }

  async loadHods(): Promise<void> {
    try {
      this.utilSvc.showSpinner('hods-spinner');
      const filters: IUserFilters = {
        page: 1,
        limit: 5,
        sort: AppDefaults.SORT as string,
        sortBy: SortBy.DESC,
      };
      this.userData = await this.userSvc.getUsers(filters);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('hods-spinner');
    }
  }
}
