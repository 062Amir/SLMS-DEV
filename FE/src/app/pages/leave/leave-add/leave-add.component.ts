import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { leaveStatusTypes } from 'src/app/app.constants';
import { AppValidators } from 'src/app/core/classes/app-validator.class';
import { ILeave } from 'src/app/core/interfaces/leave.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LeaveService } from 'src/app/core/services/leave.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-leave-add',
  templateUrl: './leave-add.component.html',
  styleUrls: ['./leave-add.component.css'],
})
export class LeaveAddComponent implements OnInit {
  addLeaveForm: FormGroup;
  loggedInUser: IUser;

  get fromMinDate(): NgbDateStruct {
    return this.utilSvc.getNgbDate(new Date());
  }

  get toMinDate(): NgbDateStruct {
    return this.addLeaveForm.controls['fromDate'].value || this.utilSvc.getNgbDate(new Date());
  }

  constructor(
    private formBuilder: FormBuilder,
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private router: Router,
    private authSvc: AuthService,
    private leaveSvc: LeaveService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authSvc.getLoggedInUser() as IUser;
    this.addLeaveForm = this.formBuilder.group({
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      reason: ['', [Validators.required, AppValidators.customRequired]],
    });
  }

  async onSubmit() {
    try {
      if (this.addLeaveForm.invalid) {
        this.addLeaveForm.markAllAsTouched();
        return;
      }
      this.utilSvc.showSpinner();
      const formData: any = this.addLeaveForm.value;
      const payload: ILeave = {
        leaveId: this.utilSvc.generateUniqueId(),
        userId: this.loggedInUser.userId,
        fromDate: this.utilSvc.getFormattedDate(formData.fromDate).toISOString(),
        toDate: this.utilSvc.getFormattedDate(formData.toDate).toISOString(),
        reason: formData.reason,
        status: leaveStatusTypes.PENDING,
        createdAt: new Date().toISOString(),
        user: this.loggedInUser,
        department: this.loggedInUser.department,
      };
      await this.leaveSvc.addLeave(payload);
      this.notifySvc.success('Leave applied successfully.');
      this.router.navigate(['/leaves']);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
