import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth/auth.service';
import * as fromRoot from '../../app.reducer';

interface INavList {
  link: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-sidenav-list',
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/signup"
      (click)="onClose()" *ngIf="!(isAuth$ | async)">
        <mat-icon>face</mat-icon>
        <span class="nav-caption">Signup</span>
      </a>
      <a mat-list-item routerLink="/login"
      (click)="onClose()" *ngIf="!(isAuth$ | async)">
        <mat-icon>input</mat-icon>
        <span class="nav-caption">Login</span>
      </a>
      <a mat-list-item routerLink="/training"
      (click)="onClose()" *ngIf="(isAuth$ | async)">
        <mat-icon>fitness_center</mat-icon>
        <span class="nav-caption">Training</span>
      </a>
      <mat-list-item>
        <button mat-icon-button (click)="onLogout()" *ngIf="isAuth$ | async">
          <mat-icon>eject</mat-icon>
          <span class="nav-caption">Logout</span>
        </button>
      </mat-list-item>
    </mat-nav-list>
  `,
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  isAuth$: Observable<boolean>;

  @Output() closeSidenav = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  onClose() { this.closeSidenav.emit(); }
  onLogout() {
    this.onClose();
    this.authService.logout();
  }
}
