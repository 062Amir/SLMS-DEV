import { Component, OnInit } from '@angular/core';
import { AppDefaults, SortBy, UserRoles, UserStatus } from 'src/app/app.constants';
import { ISortOptions } from 'src/app/core/interfaces/common.interface';
import { IUserFilters } from 'src/app/core/interfaces/filter.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-hod-dashboard',
  templateUrl: './hod-dashboard.component.html',
  styleUrls: ['./hod-dashboard.component.css'],
})
export class HodDashboardComponent implements OnInit {
  staffData: { total: number; data: IUser[] };
  counts = {
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
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
    this.staffData = {
      total: 0,
      data: [],
    };

    this.initData();
  }

  initData() {
    this.loadTotalMembersCounts();
    this.loadActiveMembersCounts();
    this.loadInactiveMembersCounts();
    this.loadStaffs();
  }

  async loadTotalMembersCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('total-members-count-spinner');
      this.counts.totalMembers = await this.userSvc.getUsersCount();
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('total-members-count-spinner');
    }
  }

  async loadActiveMembersCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('active-members-count-spinner');
      this.counts.activeMembers = await this.userSvc.getUsersCount({
        status: UserStatus.ACTIVE,
      });
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('active-members-count-spinner');
    }
  }

  async loadInactiveMembersCounts(): Promise<void> {
    try {
      this.utilSvc.showSpinner('inactive-members-count-spinner');
      this.counts.inactiveMembers = await this.userSvc.getUsersCount({
        status: UserStatus.INACTIVE,
      });
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('inactive-members-count-spinner');
    }
  }

  async loadStaffs(): Promise<void> {
    try {
      this.utilSvc.showSpinner('staff-spinner');
      const filters: IUserFilters = {
        page: 1,
        limit: 5,
        sort: AppDefaults.SORT as string,
        sortBy: SortBy.DESC,
      };
      this.staffData = await this.userSvc.getUsers(filters);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner('staff-spinner');
    }
  }
}
