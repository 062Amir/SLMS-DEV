import { Component, OnInit } from '@angular/core';
import { userRoleTypes } from 'src/app/app.constants';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loggedInUser: IUser;

  get isUserHod(): boolean {
    return this.loggedInUser.role === userRoleTypes.HOD;
  }

  constructor(private authSvc: AuthService) {}

  ngOnInit(): void {
    this.loggedInUser = this.authSvc.getLoggedInUser() as IUser;
  }
}
