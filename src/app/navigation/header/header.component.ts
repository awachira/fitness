import { Component, OnInit, EventEmitter, Output } from '@angular/core';

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
        <li *ngFor="let navItem of navItems">
          <a *ngIf="navItem.link else nolink"
            routerLink="{{navItem.link}}">
            {{navItem.name}}
          </a>
          <ng-template #nolink><a>{{navItem.name}}</a></ng-template>
        </li>
      </ul>
    </div>
  </mat-toolbar>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  navItems = [
    {link: '/signup', name: 'Sign Up'},
    {link: '/login', name: 'Login'},
    {link: '/training', name: 'Training'},
    {name: 'Logout'}
  ];

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }
}
