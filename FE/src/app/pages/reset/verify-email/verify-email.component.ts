import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  verifyEmailForm: FormGroup;
  requestSent: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private notifySvc: AppNotificationService,
    public utilSvc: UtilService,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.verifyEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.requestSent = false;
  }

  async onSubmit() {
    try {
      if (this.verifyEmailForm.invalid) {
        this.verifyEmailForm.markAllAsTouched();
        return;
      }
      this.utilSvc.showSpinner();
      const formData: any = this.verifyEmailForm.value;
      await this.authSvc.verifyEmail(formData);
      this.requestSent = true;
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
