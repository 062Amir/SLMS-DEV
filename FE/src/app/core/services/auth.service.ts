import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { apiResourses, appMessages, localStorageKeys } from 'src/app/app.constants';
import { ILoginCredentials, IUserCredentials } from '../interfaces/credentials.interface';
import { IUser } from '../interfaces/user.interface';
import { UtilService } from './util.service';

@Injectable()
export class AuthService {
  get isUserLoggedIn(): boolean {
    return this.getLoggedInUser() ? true : false;
  }
  constructor(private http: HttpClient, private utilSvc: UtilService) {}

  async login(payload: ILoginCredentials): Promise<IUser> {
    const users = await lastValueFrom(this.http.get<IUser[]>(apiResourses.users));
    const userExists = users.find(
      (user) =>
        (user.userName === payload.userName || user.email === payload.userName || user.contactNumber === +payload.userName) &&
        user.password === payload.password
    );
    if (!userExists) {
      throw new Error(appMessages.INVALID_CREDENTIALS);
    }
    this.setLoggedInUser(userExists);
    return userExists;
  }

  async registerUser(payload: IUserCredentials): Promise<IUser> {
    const users = await lastValueFrom(this.http.get<IUser[]>(apiResourses.users));
    const userExists = users.find(
      (user) => user.contactNumber === payload.contactNumber || user.email === payload.email || user.userName === payload.userName
    );
    if (userExists) {
      throw new Error(appMessages.USER_ALREADY_EXISTS);
    }
    const registerdUser = await lastValueFrom(this.http.post<IUser>(apiResourses.users, payload, this.utilSvc.getHttpOptions()));
    this.setLoggedInUser(registerdUser);
    return registerdUser;
  }

  private setLoggedInUser(user: IUser): boolean {
    user.password = '';
    localStorage.setItem(localStorageKeys.loggedInUser, JSON.stringify(user));
    return true;
  }

  getLoggedInUser(): IUser | null {
    const user = localStorage.getItem(localStorageKeys.loggedInUser);
    return user ? JSON.parse(user) : null;
  }

  logout(): boolean {
    localStorage.removeItem(localStorageKeys.loggedInUser);
    return true;
  }
}
