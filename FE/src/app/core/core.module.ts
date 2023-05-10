import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LeaveService } from './services/leave.service';
import { SidebarService } from './services/sidebar.service';
import { StaffService } from './services/staff.service';
import { UtilService } from './services/util.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StorageService } from './services/storage.service';
import { DepartmentService } from './services/department.service';
import { TokenInterceptor } from './interceptors/token.interceptor';

export const getDocumentRef = () => (typeof document !== 'undefined' ? document : null);

export const getWindowRef = () => (typeof window !== 'undefined' ? window : null);

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: 'DOCUMENT',
      useFactory: getDocumentRef,
    },
    {
      provide: 'WINDOW',
      useFactory: getWindowRef,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AuthService,
    StorageService,
    DepartmentService,
    LeaveService,
    SidebarService,
    StaffService,
    UtilService,
  ],
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
