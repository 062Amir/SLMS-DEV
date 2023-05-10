import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRoles } from 'src/app/app.constants';
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
  userRole: `${UserRoles}`;

  get formHeading(): string {
    return this.userRole === UserRoles.HOD ? 'HOD Registration' : 'Staff Registration';
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private notifySvc: AppNotificationService,
    public utilSvc: UtilService,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = this.activatedRoute.snapshot.params['userRole']?.toUpperCase() || '';
    this.userRole = Object.values(UserRoles).includes(role) ? role : UserRoles.STAFF;
  }

  async onSubmit(userCredentials: FormData) {
    try {
      this.utilSvc.showSpinner();
      await this.authSvc.registerUser(userCredentials);
      this.notifySvc.success('User registered successfully.');
      this.router.navigate(['/login']);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
