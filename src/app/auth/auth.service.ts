import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { Subject } from 'rxjs/Subject';

import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

import { User } from './user.model';
import { AuthData } from './auth-data.model';

import { uuid } from '../util';
import { TrainingService } from '../training/training.service';
import { UIEventsService } from '../services/uievents.service';

@Injectable() // to inject a servcice into another this is required.
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

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
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.router.navigate(['/training']);
        } else {
          this.trainingSrvc.cancelFireSubscriptions();
          this.authChange.next(false);
          this.router.navigate(['/login']);
          this.isAuthenticated = false;
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

  isAuth(): boolean { return this.isAuthenticated; }
}
