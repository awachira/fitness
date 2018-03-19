import { Injectable } from '@angular/core';
import {
  Route,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad
} from '@angular/router';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private store: Store<fromRoot.State>
  ) { }

  canActivate(ars: ActivatedRouteSnapshot, rss: RouterStateSnapshot) {
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    // }
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }

  canLoad(route: Route) {
  //   if (this.authService.isAuth()) {
  //     return true;
  //   } else {
  //     this.router.navigate(['/login']);
  //   }
  // }
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }
}
