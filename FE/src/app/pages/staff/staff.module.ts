import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffDetailComponent } from './staff-detail/staff-detail.component';
import { StaffAddComponent } from './staff-add/staff-add.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StaffListComponent, StaffDetailComponent, StaffAddComponent],
  imports: [CommonModule, StaffRoutingModule, NgbModule, FormsModule, ReactiveFormsModule, SharedModule],
})
export class StaffModule {}
