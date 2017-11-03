import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
  role: string;

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.role = this.authService.getUserRole();
    const roles = route.data['roles'] as Array<string>;
    if (roles.indexOf(this.role) !== -1) {
      return true;
    }

    if (this.role === 'Provider') {
      this.router.navigate(['/provider-profile']);
    } else if (this.role === 'Rater') {
      this.router.navigate(['/rater-profile']);
    } else {
      this.router.navigate(['/home']);
    }
    return false;
  }
}
