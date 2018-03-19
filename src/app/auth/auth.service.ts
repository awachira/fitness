import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

import { User } from './user.model';
import { AuthData } from './auth-data.model';

import { uuid } from '../util';
import { TrainingService } from '../training/training.service';
import { UIEventsService } from '../services/uievents.service';

@Injectable() // to inject a servcice into another this is required.
export class AuthService {
  // authChange = new Subject<boolean>();
  // private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingSrvc: TrainingService,
    private uiService: UIEventsService,
    private store: Store<fromRoot.State>
  ) { }

  initAuthListener() {
    this.afAuth.authState
      .subscribe(user => {
        if (user) {
          this.store.dispatch(new Auth.SetAuthenticated());
          // this.isAuthenticated = true;
          // this.authChange.next(true);
          this.router.navigate(['/training']);
        } else {
          // this.authChange.next(false);
          // this.isAuthenticated = false;
          this.store.dispatch(new Auth.SetUnauthenticated());
          this.trainingSrvc.cancelFireSubscriptions();
          this.router.navigate(['/login']);
        }
      });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .createUserWithEmailAndPassword(
        authData.email,
        authData.password)
      .then(result => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .signInWithEmailAndPassword(
        authData.email,
        authData.password)
      .then(result => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  // isAuth(): boolean { return this.isAuthenticated; }
}
