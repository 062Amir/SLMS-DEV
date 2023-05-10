import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { leaveStatusTypes } from 'src/app/app.constants';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { v4 as uuid } from 'uuid';
import { IListResponse } from '../interfaces/common.interface';
import { ILeave } from '../interfaces/leave.interface';

@Injectable()
export class UtilService {
  constructor(private spinner: NgxSpinnerService, private modalSvc: NgbModal) {}

  isFieldInvalid(field: string, form: FormGroup, error: string = '') {
    return !form.controls[field].valid && form.controls[field].touched && (error ? form.controls[field].hasError(error) : 1);
  }

  showSpinner(name: string = '') {
    name ? this.spinner.show(name) : this.spinner.show();
  }

  hideSpinner(name: string = '') {
    name ? this.spinner.hide(name) : this.spinner.hide();
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  generateUniqueId(): string {
    return uuid();
  }

  getHttpOptions(filters: any = {}) {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (typeof filters[key] !== 'undefined') {
        params = params.append(key, filters[key]);
      }
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params,
    };
    return httpOptions;
  }

  getFormattedDate(date?: NgbDateStruct): Date {
    const newDate: Date = new Date();
    if (!date) {
      return new Date(newDate);
    }
    return new Date(newDate.setFullYear(date.year, date.month - 1, date.day));
  }

  getNgbDate(date?: string | Date): NgbDateStruct {
    date = date ? new Date(date) : new Date();
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  }

  getListResponse(response: any): IListResponse {
    return {
      data: response?.body || [],
      total: +(response?.headers?.get('X-Total-Count') || 0),
    };
  }

  getLeaveStatus(leave: ILeave): string {
    switch (leave.status) {
      case leaveStatusTypes.PENDING:
        return 'bg-warning';
      case leaveStatusTypes.REJECTED:
        return 'bg-danger';
      case leaveStatusTypes.APPROVED:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  async showConfirmation(msg: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        centered: true,
        keyboard: false,
        size: 'md',
      };
      const modalRef = this.modalSvc.open(ConfirmModalComponent, ngbModalOptions);
      modalRef.componentInstance.msg = msg;
      resolve((await modalRef.result) || false);
    });
  }
}
