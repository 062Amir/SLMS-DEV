import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { apiResourses } from 'src/app/app.constants';
import { IListResponse } from '../interfaces/common.interface';
import { IUserCredentials } from '../interfaces/credentials.interface';
import { IStaffFilters } from '../interfaces/filter.interface';
import { ILeave } from '../interfaces/leave.interface';
import { IUser } from '../interfaces/user.interface';
import { UtilService } from './util.service';

@Injectable()
export class StaffService {
  constructor(private http: HttpClient, private utilSvc: UtilService) {}

  async getStaffs(filters: IStaffFilters): Promise<IListResponse> {
    const httpOptions: any = this.utilSvc.getHttpOptions(filters);
    httpOptions.observe = 'response';
    const response: any = await lastValueFrom(this.http.get(apiResourses.users, httpOptions));
    return this.utilSvc.getListResponse(response);
  }

  async getSingleStaff(userId: string): Promise<IUser> {
    const response = await lastValueFrom(this.http.get<IUser[]>(`${apiResourses.users}?userId=${userId}`));
    return response[0];
  }

  async addStaffMember(payload: IUserCredentials): Promise<IUser> {
    return await lastValueFrom(this.http.post<IUser>(apiResourses.users, payload, this.utilSvc.getHttpOptions()));
  }

  async getStaffsCount(filters: IStaffFilters): Promise<number> {
    const response: IUser[] = await lastValueFrom(this.http.get<IUser[]>(apiResourses.users, this.utilSvc.getHttpOptions(filters)));
    return response?.length || 0;
  }

  async deleteStaffMember(staff: IUser): Promise<boolean> {
    await lastValueFrom(this.http.delete<any>(`${apiResourses.users}/${staff.id}`));
    const userLeaves: ILeave[] = await lastValueFrom(
      this.http.get<ILeave[]>(`${apiResourses.leaves}?userId=${staff.userId}`, this.utilSvc.getHttpOptions())
    );
    for (const leave of userLeaves) {
      await lastValueFrom(this.http.delete<ILeave>(`${apiResourses.leaves}/${leave.id}`, this.utilSvc.getHttpOptions()));
    }
    return true;
  }
}
