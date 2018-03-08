import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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
      (click)="onClose()" *ngIf="!isAuth">
        <mat-icon>face</mat-icon>
        <span class="nav-caption">Signup</span>
      </a>
      <a mat-list-item routerLink="/login"
      (click)="onClose()" *ngIf="!isAuth">
        <mat-icon>input</mat-icon>
        <span class="nav-caption">Login</span>
      </a>
      <a mat-list-item routerLink="/training"
      (click)="onClose()" *ngIf="isAuth">
        <mat-icon>fitness_center</mat-icon>
        <span class="nav-caption">Training</span>
      </a>
      <mat-list-item>
        <button mat-icon-button (click)="onClose()" *ngIf="isAuth">
          <mat-icon>eject</mat-icon>
          <span class="nav-caption">Logout</span>
        </button>
      </mat-list-item>
    </mat-nav-list>
  `,
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  isAuth = false;
  subScribed: Subscription;

  navListNA: Array<INavList>;
  navListA: Array<INavList>;

  @Output() closeSidenav = new EventEmitter<void>();

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subScribed = this.authService.authChange
      .subscribe(authStatus => this.isAuth = authStatus);

    this.navListNA = [
      {link: '/signup', name: 'Signup', icon: 'face'},
      {link: '/login', name: 'Login', icon: 'input'}
    ];

    this.navListA = [
      {link: '/training', name: 'Training', icon: 'fitness_center'}
    ];
  }

  ngOnDestroy() { this.subScribed.unsubscribe(); }
  onClose() { this.closeSidenav.emit(); }
}
