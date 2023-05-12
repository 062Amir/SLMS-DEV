import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoles } from './app.constants';
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
      roles: [UserRoles.ADMIN, UserRoles.HOD, UserRoles.STAFF],
    },
    loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'departments',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.ADMIN],
    },
    loadChildren: () => import('./pages/department/department.module').then((m) => m.DepartmentModule),
  },
  {
    path: 'leaves',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.HOD, UserRoles.STAFF],
    },
    loadChildren: () => import('./pages/leave/leave.module').then((m) => m.LeaveModule),
  },
  {
    path: 'hods',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.ADMIN],
    },
    loadChildren: () => import('./pages/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'staff',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.HOD],
    },
    loadChildren: () => import('./pages/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'profile',
    canActivate: [PostAuthGuard],
    data: {
      roles: [UserRoles.ADMIN, UserRoles.HOD, UserRoles.STAFF],
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
