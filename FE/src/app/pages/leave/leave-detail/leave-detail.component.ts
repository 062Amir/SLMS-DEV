import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { leaveStatusTypes, userRoleTypes } from 'src/app/app.constants';
import { ILeave } from 'src/app/core/interfaces/leave.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LeaveService } from 'src/app/core/services/leave.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.css'],
})
export class LeaveDetailComponent implements OnInit {
  leaveId: string;
  leaveInfo: ILeave | null;
  loggedInUser: IUser;

  get isUserHod(): boolean {
    return this.loggedInUser.role === userRoleTypes.HOD;
  }

  get leaveStatusTypes() {
    return leaveStatusTypes;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private leaveSvc: LeaveService,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.leaveId = this.activatedRoute.snapshot.params['leaveId'];
    this.leaveInfo = null;
    this.loggedInUser = this.authSvc.getLoggedInUser() as IUser;

    this.loadLeaveInfo();
  }

  async loadLeaveInfo(): Promise<void> {
    try {
      this.utilSvc.showSpinner();
      this.leaveInfo = await this.leaveSvc.getSingleLeave(this.leaveId);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  async updateLeaveStatus(status: string) {
    try {
      const msg = `Are you sure to ${status === leaveStatusTypes.APPROVED ? 'approve' : 'reject'} this leave?`;
      const result = await this.utilSvc.showConfirmation(msg);
      if (result) {
        this.utilSvc.showSpinner();
        await this.leaveSvc.updateLeave(this.leaveInfo?.id as number, { status });
        this.notifySvc.success('Leave updated successfully');
        this.router.navigate(['/leaves']);
      }
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }
}
