import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userRoleTypes } from 'src/app/app.constants';
import { IUserCredentials } from 'src/app/core/interfaces/credentials.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  userRole: string;

  get formHeading(): string {
    return this.userRole === userRoleTypes.HOD ? 'HOD Registration' : 'Staff Registration';
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private notifySvc: AppNotificationService,
    public utilSvc: UtilService,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = Object.values(userRoleTypes).includes(this.activatedRoute.snapshot.params['userRole'])
      ? this.activatedRoute.snapshot.params['userRole']
      : userRoleTypes.STAFF;
  }

  async onSubmit(userCredentials: IUserCredentials) {
    try {
      this.utilSvc.showSpinner();
      await this.authSvc.registerUser(userCredentials);
      this.notifySvc.success('User registered successfully.');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
