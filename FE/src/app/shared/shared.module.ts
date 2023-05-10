import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserFormComponent } from './components/add-user-form/add-user-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { UserImgComponent } from './components/user-img/user-img.component';
import { StaffDashboardComponent } from './components/staff-dashboard/staff-dashboard.component';
import { HodDashboardComponent } from './components/hod-dashboard/hod-dashboard.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TableComponent } from './components/table/table.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AddEditDepartmentComponent } from './components/add-edit-department/add-edit-department.component';

@NgModule({
  declarations: [
    AddUserFormComponent,
    SidebarComponent,
    HeaderComponent,
    UserImgComponent,
    StaffDashboardComponent,
    HodDashboardComponent,
    TableComponent,
    ConfirmModalComponent,
    AdminDashboardComponent,
    AddEditDepartmentComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule, RouterModule, NgxSpinnerModule],
  exports: [
    AddUserFormComponent,
    SidebarComponent,
    HeaderComponent,
    UserImgComponent,
    StaffDashboardComponent,
    HodDashboardComponent,
    TableComponent,
    ConfirmModalComponent,
    AdminDashboardComponent,
  ],
})
export class SharedModule {}
