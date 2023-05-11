import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserStatus } from 'src/app/app.constants';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { UserService } from 'src/app/core/services/user.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  userId: string;
  userInfo: IUser | null;

  get UserStatus() {
    return UserStatus;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private userSvc: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params['userId'];
    this.userInfo = null;

    this.loadUserInfo();
  }

  async loadUserInfo(): Promise<void> {
    try {
      this.utilSvc.showSpinner();
      this.userInfo = await this.userSvc.getSingleUser(this.userId);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  async updateUserStatus(status: `${UserStatus}`) {
    try {
      const msg = `Are you sure to ${status === UserStatus.ACTIVE ? 'activate' : 'deactivate'} this user?`;
      const result = await this.utilSvc.showConfirmation(msg);
      if (result) {
        this.utilSvc.showSpinner();
        const action = status === UserStatus.ACTIVE ? 'activate' : 'deactivate';
        await this.userSvc.updateUserStatus(this.userId, action);
        this.notifySvc.success('User status updated successfully');
        await this.loadUserInfo();
      }
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  async deleteUser() {
    try {
      const result = await this.utilSvc.showConfirmation('Are you sure to delete this user?');
      if (result) {
        this.utilSvc.showSpinner();
        await this.userSvc.deleteUser(this.userId);
        this.notifySvc.success('User deleted successfully.');
        this.location.back();
      }
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
