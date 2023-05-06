import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { userRoleTypes } from 'src/app/app.constants';
import { PostAuthGuard } from 'src/app/core/guards/post-auth.guard';
import { StaffAddComponent } from './staff-add/staff-add.component';
import { StaffDetailComponent } from './staff-detail/staff-detail.component';
import { StaffListComponent } from './staff-list/staff-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PostAuthGuard],
    data: {
      roles: [userRoleTypes.HOD],
    },
    component: StaffListComponent,
  },
  {
    path: 'new',
    canActivate: [PostAuthGuard],
    data: {
      roles: [userRoleTypes.HOD],
    },
    component: StaffAddComponent,
  },
  {
    path: ':staffId',
    canActivate: [PostAuthGuard],
    data: {
      roles: [userRoleTypes.HOD],
    },
    component: StaffDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffRoutingModule {}
