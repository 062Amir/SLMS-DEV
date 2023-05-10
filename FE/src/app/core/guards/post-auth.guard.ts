import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class PostAuthGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const roles: string[] = route.data['roles'] || '';
    if (this.authSvc.isUserLoggedIn) {
      const loggedInUser = this.authSvc.getLoggedInUser;
      if (roles.includes(loggedInUser.role)) {
        return true;
      }
      this.router.navigate(['/dashboard']);
      return false;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
