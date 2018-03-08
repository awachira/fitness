import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

import { Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  template: `
  <mat-toolbar color="accent">
    <div fxHide.gt-xs>
      <button mat-icon-button
      (click)="onToggleSidenav()"><mat-icon>menu</mat-icon></button>
    </div>
    <div><a routerLink="/">LOGO</a></div>
    <div fxFlex fxLayout fxLayoutAlign="flex-end" fxHide.xs>
      <ul fxLayout fxLayoutGap="10px" class="navigation-items">
        <li *ngIf="!isAuth"><a routerLink="/signup">Signup</a></li>
        <li *ngIf="!isAuth"><a routerLink="/login">Login</a></li>
        <li *ngIf="isAuth"><a routerLink="/training">Training</a></li>
        <li *ngIf="isAuth"><a>Logout</a></li>
      </ul>
    </div>
  </mat-toolbar>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  authSubscription: Subscription;

  navItems = [
    { link: '/signup',
      name: 'Sign Up',
      show: () => !this.isAuth },
    { link: '/login',
      name: 'Login',
      show: () => !this.isAuth },
    { link: '/training',
      name: 'Training',
      show: () => this.isAuth },
    { name: 'Logout',
      show: () => this.isAuth }
  ];

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authSubscription = this.authService
      .authChange.subscribe(
        authStatus => this.isAuth = authStatus );
  }

  ngOnDestroy() { this.authSubscription.unsubscribe(); }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }
}
