import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserRoles } from 'src/app/app.constants';
import { IUserCredentials } from 'src/app/core/interfaces/credentials.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css'],
})
export class AddEditUserComponent implements OnInit {
  get userRoleType() {
    return UserRoles;
  }

  get isUserAdmin(): boolean {
    return this.authSvc.getLoggedInUser.role === UserRoles.ADMIN;
  }

  get isUserHod(): boolean {
    return this.authSvc.getLoggedInUser.role === UserRoles.HOD;
  }

  get defaultDepartment(): string {
    return this.authSvc.getLoggedInUser.department._id;
  }

  constructor(
    private notifySvc: AppNotificationService,
    public utilSvc: UtilService,
    private location: Location,
    public authSvc: AuthService,
    private userSvc: UserService
  ) {}

  ngOnInit(): void {}

  async onSubmit(userCredentials: FormData) {
    try {
      this.utilSvc.showSpinner();
      await this.userSvc.addUser(userCredentials);
      this.notifySvc.success('User added successfully.');
      this.location.back();
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  goBack(event: Event) {
    event.preventDefault();
    this.location.back();
  }
}
