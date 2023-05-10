import { Component, OnInit } from '@angular/core';
import { UserRoles } from 'src/app/app.constants';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  get UserRoles() {
    return UserRoles;
  }

  constructor(public authSvc: AuthService) {}

  ngOnInit(): void {}
}
