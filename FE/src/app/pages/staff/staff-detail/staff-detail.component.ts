import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { StaffService } from 'src/app/core/services/staff.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.css'],
})
export class StaffDetailComponent implements OnInit {
  staffId: string;
  staffInfo: IUser | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private staffSvc: StaffService
  ) {}

  ngOnInit(): void {
    this.staffId = this.activatedRoute.snapshot.params['staffId'];
    this.staffInfo = null;

    this.loadLeaveInfo();
  }

  async loadLeaveInfo(): Promise<void> {
    try {
      this.utilSvc.showSpinner();
      this.staffInfo = await this.staffSvc.getSingleStaff(this.staffId);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
