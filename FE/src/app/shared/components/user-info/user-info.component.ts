import { Component, Input, OnInit } from '@angular/core';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
  @Input() user: IUser;

  constructor(public utilSvc: UtilService) {}

  ngOnInit(): void {}
}
