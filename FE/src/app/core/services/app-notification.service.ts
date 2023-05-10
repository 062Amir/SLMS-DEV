import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppMessages } from 'src/app/app.constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppNotificationService {
  constructor(private toastr: ToastrService, private router: Router, private authSvc: AuthService) {}

  success(msg: string) {
    this.toastr.success(msg);
  }

  error(e: any) {
    const msg: string = e.error ? e.error.message : e.message;
    this.toastr.error(msg || AppMessages.DEFAULT_ERROR);
    if (e.status === 401) {
      this.authSvc.clearUserData();
      this.router.navigate(['/login']);
    }
  }
}
