import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppMessages } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root',
})
export class AppNotificationService {
  constructor(private toastr: ToastrService) {}

  success(msg: string) {
    this.toastr.success(msg);
  }

  error(e: any) {
    const msg: string = e.error ? e.error.message : e.message;
    this.toastr.error(msg || AppMessages.DEFAULT_ERROR);
  }
}
