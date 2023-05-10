import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, debounceTime } from 'rxjs';
import { AppDefaults, SortBy, UserRoles } from 'src/app/app.constants';
import { ISortChange, ISortOptions } from 'src/app/core/interfaces/common.interface';
import { IDepartment } from 'src/app/core/interfaces/department.interface';
import { IDepartmentFilters } from 'src/app/core/interfaces/filter.interface';
import { AppNotificationService } from 'src/app/core/services/app-notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditDepartmentComponent } from 'src/app/shared/components/add-edit-department/add-edit-department.component';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
})
export class DepartmentListComponent implements OnInit, AfterViewInit, OnDestroy {
  departmentData: { total: number; data: IDepartment[] };
  filters: IDepartmentFilters;
  pageNumber: number;
  filterForm: FormGroup;
  sort: ISortChange;
  subscriptions: Subscription;

  sortOptions: ISortOptions[] = [
    {
      label: 'Name',
      value: 'name',
    },
    {
      label: 'Created At',
      value: 'createdAt',
    },
    {
      label: '',
      value: '',
    },
  ];

  get pageCount() {
    return AppDefaults.PAGE_COUNT as number;
  }

  get UserRoles() {
    return UserRoles;
  }

  constructor(
    public utilSvc: UtilService,
    private notifySvc: AppNotificationService,
    private departmentSvc: DepartmentService,
    public authSvc: AuthService,
    private formBuilder: FormBuilder,
    private modalSvc: NgbModal
  ) {}

  ngOnInit(): void {
    this.departmentData = {
      total: 0,
      data: [],
    };
    this.filters = {};
    this.sort = {
      sort: AppDefaults.SORT as string,
      sortBy: SortBy.DESC,
    };
    this.pageNumber = 1;
    this.subscriptions = new Subscription();

    this.filterForm = this.formBuilder.group({
      search: ['', []],
    });

    this.applyFilters();
  }

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe((formData: any) => {
        this.applyFilters();
      })
    );
  }

  applyFilters(): void {
    this.filters = {};
    this.pageNumber = 1;
    this.filters.page = this.pageNumber;
    this.filters.limit = AppDefaults.PAGE_COUNT;
    this.filters.sort = this.sort.sort;
    this.filters.sortBy = this.sort.sortBy;

    const formData = this.filterForm.value;
    if (formData.search) {
      this.filters.q = formData.search;
    }

    this.loadDepartments();
  }

  async loadDepartments(): Promise<void> {
    try {
      this.utilSvc.showSpinner();
      this.departmentData = await this.departmentSvc.getDepartments(this.filters);
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  onPageChange(): void {
    this.filters.page = this.pageNumber;
    this.loadDepartments();
  }

  onSortChange(sort: ISortChange) {
    this.sort = sort;
    this.filters.sort = sort.sort;
    this.filters.sortBy = sort.sortBy;
    this.loadDepartments();
  }

  async addEditDepartment(department?: IDepartment) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      centered: true,
      keyboard: false,
      size: 'md',
    };
    const modalRef = this.modalSvc.open(AddEditDepartmentComponent, ngbModalOptions);
    modalRef.componentInstance.department = department;
    const response = (await modalRef.result) || false;
    if (response) {
      this.loadDepartments();
    }
  }

  async deleteDepartment(department: IDepartment) {
    try {
      const result = await this.utilSvc.showConfirmation('Are you sure to delete this department?');
      if (result) {
        this.utilSvc.showSpinner();
        await this.departmentSvc.deleteDepartment(department._id);
        this.notifySvc.success('Department deleted successfully.');
        this.loadDepartments();
      }
    } catch (error) {
      this.notifySvc.error(error);
    } finally {
      this.utilSvc.hideSpinner();
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
