import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRoles, allowedImageTypes } from 'src/app/app.constants';
import { AppValidators } from 'src/app/core/classes/app-validator.class';
import { IUserCredentials } from 'src/app/core/interfaces/credentials.interface';
import { IDepartment } from 'src/app/core/interfaces/department.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
})
export class AddUserFormComponent implements OnInit {
  @Input() userRole: `${UserRoles}`;
  @Input() defaultDepartment: string;
  @Input() disableDepartment: boolean = false;
  @Input() isUpdateForm: boolean = false;
  @Output() formSubmit: EventEmitter<FormData> = new EventEmitter<FormData>();

  addUserForm: FormGroup;
  departmentOptions: IDepartment[];

  constructor(
    private formBuilder: FormBuilder,
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private departmentSvc: DepartmentService
  ) {}

  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
      profileImage: ['', [AppValidators.fileType(allowedImageTypes), AppValidators.fileSize()]],
      name: ['', [Validators.required, AppValidators.customRequired]],
      userName: ['', [Validators.required, AppValidators.customRequired]],
      email: ['', [Validators.required, AppValidators.email]],
      contactNumber: ['', [Validators.required, AppValidators.contact]],
      departmentId: [this.defaultDepartment || '', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.departmentOptions = [];

    if (this.disableDepartment) {
      this.addUserForm.controls['departmentId'].disable();
    }
    if (!this.isUpdateForm) {
      this.loadDepartment();
    }
  }

  async loadDepartment() {
    try {
      this.utilSvc.showSpinner();
      const response = await this.departmentSvc.getDepartments();
      this.departmentOptions = response.data;
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  async onImageChange(event: any) {
    let file: File = event && event.target.files.length ? event.target.files[0] : null;
    this.addUserForm.controls['profileImage'].setValue(file || null, { emitModelToViewChange: false });
  }

  async onSubmit() {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      return;
    }
    const userData: any = this.addUserForm.getRawValue();
    const formData: FormData = new FormData();
    formData.append('name', userData.name || '');
    formData.append('userName', userData.userName || '');
    formData.append('email', userData.email || '');
    formData.append('contactNumber', userData.contactNumber || '');
    formData.append('role', this.userRole);
    formData.append('password', userData.password || '');
    formData.append('departmentId', userData.departmentId || '');
    if (userData.profileImage) {
      formData.append('profileImage', userData.profileImage || '');
    }
    this.formSubmit.emit(formData);
  }
}
