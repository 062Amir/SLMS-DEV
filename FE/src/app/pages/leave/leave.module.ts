import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveRoutingModule } from './leave-routing.module';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveDetailComponent } from './leave-detail/leave-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeaveAddEditComponent } from './leave-add-edit/leave-add-edit.component';

@NgModule({
  declarations: [LeaveListComponent, LeaveDetailComponent, LeaveAddEditComponent],
  imports: [CommonModule, LeaveRoutingModule, NgbModule, FormsModule, ReactiveFormsModule, SharedModule],
})
export class LeaveModule {}
