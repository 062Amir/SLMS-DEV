import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { userRoleTypes } from './app.constants';
import { PostAuthGuard } from './core/guards/post-auth.guard';
import { PreAuthGuard } from './core/guards/pre-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [PreAuthGuard],
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    canActivate: [PreAuthGuard],
    loadChildren: () => import('./pages/register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'dashboard',
    canActivate: [PostAuthGuard],
    data: {
      roles: [userRoleTypes.HOD, userRoleTypes.STAFF],
    },
    loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'leaves',
    canActivate: [PostAuthGuard],
    data: {
      roles: [userRoleTypes.HOD, userRoleTypes.STAFF],
    },
    loadChildren: () => import('./pages/leave/leave.module').then((m) => m.LeaveModule),
  },
  {
    path: 'staff',
    canActivate: [PostAuthGuard],
    data: {
      roles: [userRoleTypes.HOD],
    },
    loadChildren: () => import('./pages/staff/staff.module').then((m) => m.StaffModule),
  },
  {
    path: 'profile',
    canActivate: [PostAuthGuard],
    data: {
      roles: [userRoleTypes.HOD, userRoleTypes.STAFF],
    },
    loadChildren: () => import('./pages/my-profile/my-profile.module').then((m) => m.MyProfileModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}