import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { PostAuthGuard } from 'src/app/core/guards/post-auth.guard';
import { UserRoles } from 'src/app/app.constants';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
  },
  {
    path: 'new',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.ADMIN, UserRoles.HOD],
    },
    component: AddEditUserComponent,
  },
  {
    path: ':userId',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.ADMIN, UserRoles.HOD],
    },
    component: UserDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
