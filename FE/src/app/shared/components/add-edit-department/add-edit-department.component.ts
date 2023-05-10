import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppValidators } from 'src/app/core/classes/app-validator.class';
import { IDepartment } from 'src/app/core/interfaces/department.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-add-edit-department',
  templateUrl: './add-edit-department.component.html',
  styleUrls: ['./add-edit-department.component.css'],
})
export class AddEditDepartmentComponent implements OnInit {
  @Input() public department?: IDepartment;

  departmentForm: FormGroup;

  get modalTitle(): string {
    return this.department ? 'Update Department' : 'Add Department';
  }

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private departmentSvc: DepartmentService
  ) {}

  ngOnInit(): void {
    this.departmentForm = this.formBuilder.group({
      name: ['', [Validators.required, AppValidators.customRequired]],
    });

    if (this.department) {
      this.departmentForm.patchValue(this.department);
    }
  }

  async onSubmit() {
    try {
      if (this.departmentForm.invalid) {
        this.departmentForm.markAllAsTouched();
        return;
      }
      this.utilSvc.showSpinner();
      const formData = this.departmentForm.value;
      let response = null;
      if (this.department) {
        response = await this.departmentSvc.updateDepartment(this.department._id, formData);
      } else {
        response = await this.departmentSvc.addDepartment(formData);
      }
      this.activeModal.close(response);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  closeModal(): void {
    this.activeModal.close(null);
  }
}
