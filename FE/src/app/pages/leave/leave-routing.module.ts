import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { userRoleTypes } from 'src/app/app.constants';
import { PostAuthGuard } from 'src/app/core/guards/post-auth.guard';
import { LeaveAddComponent } from './leave-add/leave-add.component';
import { LeaveDetailComponent } from './leave-detail/leave-detail.component';
import { LeaveListComponent } from './leave-list/leave-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PostAuthGuard],
    data: {
      roles: [userRoleTypes.HOD, userRoleTypes.STAFF],
    },
    component: LeaveListComponent,
  },
  {
    path: 'new',
    canActivate: [PostAuthGuard],
    data: {
      roles: [userRoleTypes.STAFF],
    },
    component: LeaveAddComponent,
  },
  {
    path: ':leaveId',
    canActivate: [PostAuthGuard],
    data: {
      roles: [userRoleTypes.HOD, userRoleTypes.STAFF],
    },
    component: LeaveDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveRoutingModule {}
