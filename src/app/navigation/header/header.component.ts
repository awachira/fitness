import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../app.reducer';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  template: `
  <mat-toolbar color="accent">
    <div fxHide.gt-xs>
      <button mat-icon-button
      (click)="onToggleSidenav()"><mat-icon>menu</mat-icon></button>
    </div>
    <div><a routerLink="/">Fitness Tracker</a></div>
    <div fxFlex fxLayout fxLayoutAlign="flex-end" fxHide.xs>
      <ul fxLayout fxLayoutGap="10px" class="navigation-items">
        <li *ngIf="!(isAuth$ | async)"><a routerLink="/signup">Signup</a></li>
        <li *ngIf="!(isAuth$ | async)"><a routerLink="/login">Login</a></li>
        <li *ngIf="isAuth$ | async"><a routerLink="/training">Training</a></li>
        <li *ngIf="isAuth$ | async"><a style="cursor: pointer" (click)="onLogout()">Logout</a></li>
      </ul>
    </div>
  </mat-toolbar>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuth$: Observable<boolean>;

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  onLogout() { this.authService.logout(); }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }
}
