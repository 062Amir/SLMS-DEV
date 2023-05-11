import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { apiResourses } from 'src/app/app.constants';
import { IListResponse } from '../interfaces/common.interface';
import { IUserCredentials } from '../interfaces/credentials.interface';
import { IUserFilters } from '../interfaces/filter.interface';
import { IUser } from '../interfaces/user.interface';
import { UtilService } from './util.service';

@Injectable()
export class UserService {
  constructor(private http: HttpClient, private utilSvc: UtilService) {}

  async getUsers(filters: IUserFilters): Promise<IListResponse> {
    return await lastValueFrom(this.http.get<IListResponse>(apiResourses.user, this.utilSvc.getHttpOptions(filters)));
  }

  async getSingleUser(id: string): Promise<IUser> {
    return await lastValueFrom(this.http.get<IUser>(`${apiResourses.user}/${id}`));
  }

  async addUser(payload: FormData): Promise<IUser> {
    return await lastValueFrom(this.http.post<IUser>(apiResourses.user, payload));
  }

  async updateUserStatus(id: string, action: string): Promise<IUser> {
    const url = `${apiResourses.user}/${id}/${action}`;
    return await lastValueFrom(this.http.post<IUser>(url, null, this.utilSvc.getHttpOptions()));
  }

  async getUsersCount(filters?: IUserFilters): Promise<number> {
    const response = await lastValueFrom(this.http.get<IListResponse>(apiResourses.user, this.utilSvc.getHttpOptions(filters)));
    return response.total || 0;
  }

  async deleteUser(id: string): Promise<boolean> {
    await lastValueFrom(this.http.delete<any>(`${apiResourses.user}/${id}`));
    return true;
  }
}
