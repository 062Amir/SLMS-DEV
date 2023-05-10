import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  setItem(key: string, data: any) {
    const encryptedData = btoa(btoa(JSON.stringify(data)));
    localStorage.setItem(key, encryptedData);
    return true;
  }

  getItem(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(atob(atob(data))) : null;
  }

  removeItem(key: string): boolean {
    localStorage.removeItem(key);
    return true;
  }

  isExist(key: string): boolean {
    return localStorage.getItem(key) ? true : false;
  }
}
