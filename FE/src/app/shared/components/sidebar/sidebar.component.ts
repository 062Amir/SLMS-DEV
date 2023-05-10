import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISidebardItem } from 'src/app/core/interfaces/sidebar-item.interface';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  sidebarItems: ISidebardItem[];
  loggedInUser: IUser;

  constructor(public sidebarSvc: SidebarService, private authSvc: AuthService, private router: Router, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loggedInUser = this.authSvc.getLoggedInUser;
    this.sidebarItems = this.sidebarSvc.getSidebarItems(this.loggedInUser);
  }

  // Click event outside the sidebar component
  @HostListener('document:click', ['$event']) onClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target) && this.sidebarSvc.isSidebarOpen) {
      this.sidebarSvc.toggleSidebar();
    }
  }

  redirect(event: Event, path: string) {
    event.preventDefault();
    this.router.navigate([path]);
    this.sidebarSvc.toggleSidebar();
  }
}
