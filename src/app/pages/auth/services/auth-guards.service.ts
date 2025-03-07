import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const requiredRoles: string[] = route.data['roles'] || [];
      if (requiredRoles.length === 0) return true;

      const userRoles = this.authService.getRoles();
      if (!userRoles) {
        this.router.navigate(['/login']).then();
        return false;
      }

      const hasRole = requiredRoles.some(role => userRoles.includes(role));
      if (!hasRole) {
        this.router.navigate(['/login']).then();
        return false;
      }
      return true;
    } else {
      return true;
    }
  }
}
