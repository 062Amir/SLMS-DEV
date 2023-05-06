import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { userRoleTypes } from 'src/app/app.constants';
import { RegisterComponent } from './register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: userRoleTypes.STAFF,
    pathMatch: 'full',
  },
  {
    path: ':userRole',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
