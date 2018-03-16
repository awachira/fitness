import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UIEventsService {
  loadingStateChanged = new Subject<boolean>();
  dataLoadingStateChanged = new Subject<boolean>();

  constructor(private snackbar: MatSnackBar) { }
  showSnackbar(message, action, duration: number) {
    this.snackbar.open(message, action, {
      duration: duration
    });
  }
}
