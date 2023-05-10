import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoles } from 'src/app/app.constants';
import { RegisterComponent } from './register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: UserRoles.STAFF,
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
