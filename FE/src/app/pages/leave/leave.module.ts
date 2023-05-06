import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveRoutingModule } from './leave-routing.module';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveDetailComponent } from './leave-detail/leave-detail.component';
import { LeaveAddComponent } from './leave-add/leave-add.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LeaveListComponent, LeaveDetailComponent, LeaveAddComponent],
  imports: [CommonModule, LeaveRoutingModule, NgbModule, FormsModule, ReactiveFormsModule, SharedModule],
})
export class LeaveModule {}
