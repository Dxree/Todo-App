import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserService} from './user.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let currentUser;
    await this.userService.getCurrentUser().then(res => currentUser = res);
    if (currentUser) {
      return true;
    } else {
      await this.router.navigate(['/login']);
      return false;
    }
  }
}
