import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { userRoleTypes } from 'src/app/app.constants';
import { IUserCredentials } from 'src/app/core/interfaces/credentials.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StaffService } from 'src/app/core/services/staff.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-staff-add',
  templateUrl: './staff-add.component.html',
  styleUrls: ['./staff-add.component.css'],
})
export class StaffAddComponent implements OnInit {
  loggedInUser: IUser;

  get userRoleType() {
    return userRoleTypes;
  }

  constructor(
    private notifySvc: AppNotificationService,
    public utilSvc: UtilService,
    private router: Router,
    private authSvc: AuthService,
    private staffSvc: StaffService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authSvc.getLoggedInUser() as IUser;
  }

  async onSubmit(userCredentials: IUserCredentials) {
    try {
      this.utilSvc.showSpinner();
      await this.staffSvc.addStaffMember(userCredentials);
      this.notifySvc.success('Staff member added successfully.');
      this.router.navigate(['/staff']);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
