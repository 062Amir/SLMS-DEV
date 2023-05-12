import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AppValidators } from 'src/app/core/classes/app-validator.class';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LeaveService } from 'src/app/core/services/leave.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-leave-add-edit',
  templateUrl: './leave-add-edit.component.html',
  styleUrls: ['./leave-add-edit.component.css'],
})
export class LeaveAddEditComponent implements OnInit {
  leaveId: string;
  addEditLeaveForm: FormGroup;

  get fromMinDate(): NgbDateStruct {
    return this.utilSvc.getNgbDate(new Date());
  }

  get toMinDate(): NgbDateStruct {
    return this.addEditLeaveForm.controls['fromDate'].value || this.utilSvc.getNgbDate(new Date());
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private router: Router,
    private authSvc: AuthService,
    private leaveSvc: LeaveService
  ) {}

  ngOnInit(): void {
    this.leaveId = this.activatedRoute.snapshot.params['leaveId'];
    this.addEditLeaveForm = this.formBuilder.group({
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      reason: ['', [Validators.required, AppValidators.customRequired]],
    });

    if (this.leaveId) {
      this.initData();
    }
  }

  async initData() {
    try {
      this.utilSvc.showSpinner();
      const leave = await this.leaveSvc.getSingleLeave(this.leaveId);
      this.addEditLeaveForm.patchValue({
        fromDate: this.utilSvc.getNgbDate(leave.fromDate),
        toDate: this.utilSvc.getNgbDate(leave.toDate),
        reason: leave.reason || '',
      });
      // this.addEditLeaveForm.controls['fromDate'].disable();
      // this.addEditLeaveForm.controls['toDate'].disable();
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  async onSubmit() {
    try {
      if (this.addEditLeaveForm.invalid) {
        this.addEditLeaveForm.markAllAsTouched();
        return;
      }
      this.utilSvc.showSpinner();
      const formData: any = this.addEditLeaveForm.value;
      const payload: any = {
        fromDate: this.utilSvc.getFormattedDate(formData.fromDate, 'start').toISOString(),
        toDate: this.utilSvc.getFormattedDate(formData.toDate, 'end').toISOString(),
        reason: formData.reason || '',
      };
      if (this.leaveId) {
        await this.leaveSvc.updateLeave(this.leaveId, payload);
        this.notifySvc.success('Leave updated successfully.');
      } else {
        await this.leaveSvc.addLeave(payload);
        this.notifySvc.success('Leave applied successfully.');
      }
      this.router.navigate(['/leaves']);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
