import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { apiResourses, AppMessages, LocalStorageKeys } from 'src/app/app.constants';
import { ILoginCredentials, IUserCredentials } from '../interfaces/credentials.interface';
import { IUser } from '../interfaces/user.interface';
import { UtilService } from './util.service';
import { StorageService } from './storage.service';
import { ILoginResponse } from '../interfaces/response.interface';
import { IUpdatePassword } from '../interfaces/reset.interface';

@Injectable()
export class AuthService {
  get isUserLoggedIn(): boolean {
    return this.storageSvc.isExist(LocalStorageKeys.LOGGED_IN_USER) && this.storageSvc.isExist(LocalStorageKeys.TOKEN);
  }

  get getLoggedInUser(): IUser {
    return this.storageSvc.getItem(LocalStorageKeys.LOGGED_IN_USER);
  }

  constructor(private http: HttpClient, private utilSvc: UtilService, private storageSvc: StorageService) {}

  async login(payload: ILoginCredentials): Promise<IUser> {
    const response = await lastValueFrom(this.http.post<ILoginResponse>(apiResourses.login, payload, this.utilSvc.getHttpOptions()));
    this.storageSvc.setItem(LocalStorageKeys.LOGGED_IN_USER, response.user);
    this.storageSvc.setItem(LocalStorageKeys.TOKEN, response.token);
    return response.user;
  }

  async registerUser(payload: FormData): Promise<IUser> {
    return await lastValueFrom(this.http.post<IUser>(apiResourses.register, payload));
  }

  async verifyEmail(payload: any): Promise<any> {
    return await lastValueFrom(this.http.post<any>(apiResourses.verifyEmail, payload, this.utilSvc.getHttpOptions()));
  }

  async updatePassword(payload: IUpdatePassword): Promise<IUser> {
    return await lastValueFrom(this.http.post<IUser>(apiResourses.updatePassword, payload, this.utilSvc.getHttpOptions()));
  }

  logout() {
    this.clearUserData();
    return true;
  }

  clearUserData() {
    this.storageSvc.removeItem(LocalStorageKeys.LOGGED_IN_USER);
    this.storageSvc.removeItem(LocalStorageKeys.TOKEN);
  }
}
