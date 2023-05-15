import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUpdatePassword } from 'src/app/core/interfaces/reset.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
})
export class UpdatePasswordComponent implements OnInit {
  @Input() token: string;
  @Input() userId: string;

  updatePasswordForm: FormGroup;
  isPasswordUpdated: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private notifySvc: AppNotificationService,
    public utilSvc: UtilService,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.updatePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.isPasswordUpdated = false;
  }

  async onSubmit() {
    try {
      if (this.updatePasswordForm.invalid) {
        this.updatePasswordForm.markAllAsTouched();
        return;
      }
      this.utilSvc.showSpinner();
      const formData: any = this.updatePasswordForm.value;
      const data: IUpdatePassword = {
        userId: this.userId || '',
        token: this.token || '',
        password: formData.password || '',
      };
      await this.authSvc.updatePassword(data);
      this.isPasswordUpdated = true;
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
