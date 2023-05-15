import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetRoutingModule } from './reset-routing.module';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { ResetComponent } from './reset.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ResetComponent, VerifyEmailComponent, UpdatePasswordComponent],
  imports: [CommonModule, ResetRoutingModule, NgbModule, FormsModule, ReactiveFormsModule],
})
export class ResetModule {}
