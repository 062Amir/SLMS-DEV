import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { apiResourses, leaveStatusTypes } from 'src/app/app.constants';
import { ILeaveFilters } from '../interfaces/filter.interface';
import { ILeave } from '../interfaces/leave.interface';
import { IListResponse } from '../interfaces/common.interface';
import { UtilService } from './util.service';

@Injectable()
export class LeaveService {
  constructor(private http: HttpClient, private utilSvc: UtilService) {}

  async addLeave(payload: ILeave): Promise<ILeave> {
    return await lastValueFrom(this.http.post<ILeave>(apiResourses.leaves, payload, this.utilSvc.getHttpOptions()));
  }

  async getLeaves(filters: ILeaveFilters): Promise<IListResponse> {
    const httpOptions: any = this.utilSvc.getHttpOptions(filters);
    httpOptions.observe = 'response';
    const response: any = await lastValueFrom(this.http.get(apiResourses.leaves, httpOptions));
    return this.utilSvc.getListResponse(response);
  }

  async getLeavesCount(filters: ILeaveFilters): Promise<{ applied: number; approved: number; rejected: number }> {
    const response: ILeave[] = await lastValueFrom(this.http.get<ILeave[]>(apiResourses.leaves, this.utilSvc.getHttpOptions(filters)));
    return {
      applied: response?.length || 0,
      approved: response.filter((leave) => leave.status === leaveStatusTypes.APPROVED).length || 0,
      rejected: response.filter((leave) => leave.status === leaveStatusTypes.REJECTED).length || 0,
    };
  }

  async getSingleLeave(leaveId: string): Promise<ILeave> {
    const response = await lastValueFrom(this.http.get<ILeave[]>(`${apiResourses.leaves}?leaveId=${leaveId}`));
    return response[0];
  }

  async updateLeave(id: number, payload: any) {
    return await lastValueFrom(this.http.patch<ILeave>(`${apiResourses.leaves}/${id}`, payload, this.utilSvc.getHttpOptions()));
  }
}
