import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoles } from 'src/app/app.constants';
import { PostAuthGuard } from 'src/app/core/guards/post-auth.guard';
import { LeaveDetailComponent } from './leave-detail/leave-detail.component';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveAddEditComponent } from './leave-add-edit/leave-add-edit.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.HOD, UserRoles.STAFF],
    },
    component: LeaveListComponent,
  },
  {
    path: 'new',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.STAFF],
    },
    component: LeaveAddEditComponent,
  },
  {
    path: ':leaveId/edit',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.STAFF],
    },
    component: LeaveAddEditComponent,
  },
  {
    path: ':leaveId',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.HOD, UserRoles.STAFF],
    },
    component: LeaveDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveRoutingModule {}
