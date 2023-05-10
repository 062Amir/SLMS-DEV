import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { apiResourses, AppMessages, LocalStorageKeys } from 'src/app/app.constants';
import { ILoginCredentials, IUserCredentials } from '../interfaces/credentials.interface';
import { IUser } from '../interfaces/user.interface';
import { UtilService } from './util.service';
import { StorageService } from './storage.service';

@Injectable()
export class AuthService {
  get isUserLoggedIn(): boolean {
    return this.storageSvc.getItem(LocalStorageKeys.LOGGED_IN_USER) && this.storageSvc.getItem(LocalStorageKeys.TOKEN);
  }

  get getLoggedInUser(): IUser | null {
    return this.storageSvc.getItem(LocalStorageKeys.LOGGED_IN_USER);
  }

  constructor(private http: HttpClient, private utilSvc: UtilService, private storageSvc: StorageService) {}

  async login(payload: ILoginCredentials): Promise<IUser> {
    const users = await lastValueFrom(this.http.get<IUser[]>(apiResourses.users));
    const userExists = users.find(
      (user) =>
        (user.userName === payload.userName || user.email === payload.userName || user.contactNumber === +payload.userName) &&
        user.password === payload.password
    );
    if (!userExists) {
      throw new Error(AppMessages.INVALID_CREDENTIALS);
    }
    this.storageSvc.setItem(LocalStorageKeys.LOGGED_IN_USER, userExists);
    return userExists;
  }

  async registerUser(payload: IUserCredentials): Promise<IUser> {
    const users = await lastValueFrom(this.http.get<IUser[]>(apiResourses.users));
    const userExists = users.find(
      (user) => user.contactNumber === payload.contactNumber || user.email === payload.email || user.userName === payload.userName
    );
    if (userExists) {
      throw new Error(AppMessages.USER_ALREADY_EXISTS);
    }
    const registerdUser = await lastValueFrom(this.http.post<IUser>(apiResourses.users, payload, this.utilSvc.getHttpOptions()));
    return registerdUser;
  }

  logout() {
    this.storageSvc.removeItem(LocalStorageKeys.LOGGED_IN_USER);
    this.storageSvc.removeItem(LocalStorageKeys.TOKEN);
    return true;
  }
}
