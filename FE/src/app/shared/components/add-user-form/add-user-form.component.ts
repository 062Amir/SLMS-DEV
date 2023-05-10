import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { allowedImageTypes } from 'src/app/app.constants';
import { AppValidators } from 'src/app/core/classes/app-validator.class';
import { IUserCredentials } from 'src/app/core/interfaces/credentials.interface';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
})
export class AddUserFormComponent implements OnInit {
  @Input() userRole: string;
  @Input() defaultDepartment: string;
  @Input() disableDepartment: boolean = false;
  @Output() formSubmit: EventEmitter<IUserCredentials> = new EventEmitter<IUserCredentials>();

  addUserForm: FormGroup;

  get departmantOptions(): string[] {
    return [];
  }

  constructor(private formBuilder: FormBuilder, public utilSvc: UtilService) {}

  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
      profileImage: ['', [AppValidators.fileType(allowedImageTypes), AppValidators.fileSize()]],
      name: ['', [Validators.required, AppValidators.customRequired]],
      userName: ['', [Validators.required, AppValidators.customRequired]],
      email: ['', [Validators.required, AppValidators.email]],
      contactNumber: ['', [Validators.required, AppValidators.contact]],
      department: [this.defaultDepartment || '', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    if (this.disableDepartment) {
      this.addUserForm.controls['department'].disable();
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
    const formData: any = this.addUserForm.getRawValue();
    // const userCredentials: IUserCredentials = {
    //   userId: this.utilSvc.generateUniqueId(),
    //   name: formData.name || '',
    //   userName: formData.userName || '',
    //   email: formData.email || '',
    //   contactNumber: formData.contactNumber || '',
    //   password: formData.password || '',
    //   department: formData.department || '',
    //   role: this.userRole,
    //   createdAt: new Date().toISOString(),
    // };
    // if (formData.profileImage) {
    //   userCredentials.profileImage = await this.utilSvc.convertFileToBase64(formData.profileImage);
    // }
    // this.formSubmit.emit(userCredentials);
  }
}
