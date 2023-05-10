import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { apiResourses } from 'src/app/app.constants';
import { IDepartment } from '../interfaces/department.interface';
import { UtilService } from './util.service';

@Injectable()
export class DepartmentService {
  constructor(private http: HttpClient, private utilSvc: UtilService) {}

  async getDepartments() {
    return await lastValueFrom(this.http.get<IDepartment[]>(apiResourses.department, this.utilSvc.getHttpOptions()));
  }
}
