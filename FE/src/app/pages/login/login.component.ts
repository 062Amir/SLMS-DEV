import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppValidators } from 'src/app/core/classes/app-validator.class';
import { ILoginCredentials } from 'src/app/core/interfaces/credentials.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private notifySvc: AppNotificationService,
    public utilSvc: UtilService,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, AppValidators.customRequired]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async onSubmit() {
    try {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
      }
      this.utilSvc.showSpinner();
      const formData: ILoginCredentials = this.loginForm.value;
      await this.authSvc.login(formData);
      this.notifySvc.success('User login successfully.');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
