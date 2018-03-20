import { Injectable } from '@angular/core';
import {
  Route,
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
    private store: Store<fromRoot.State>
  ) { }

  canActivate(ars: ActivatedRouteSnapshot, rss: RouterStateSnapshot) {
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }

  canLoad(route: Route) {
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }
}
