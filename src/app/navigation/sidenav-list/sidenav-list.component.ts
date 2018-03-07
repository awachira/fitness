import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  template: `
  <mat-nav-list>
      <a mat-list-item *ngFor="let navItem of navList" routerLink="{{navItem.link}}"
      (click)="onClose()">
        <mat-icon>{{navItem.icon}}</mat-icon>
        <span class="nav-caption">{{navItem.name}}</span>
      </a>
      <mat-list-item>
        <button mat-icon-button (click)="onClose()">
            <mat-icon>eject</mat-icon>
            <span class="nav-caption">Logout</span>
          </button>
      </mat-list-item>
    </mat-nav-list>
  `,
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  navList = [
    {link: '/signup', name: 'Signup', icon: 'face'},
    {link: '/login', name: 'Login', icon: 'input'},
    {link: '/training', name: 'Training', icon: 'fitness_center'}
  ];

  @Output() closeSidenav = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.closeSidenav.emit();
  }
}
