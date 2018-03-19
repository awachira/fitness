import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UIEventsService {

  constructor(private snackbar: MatSnackBar) { }
  showSnackbar(message, action, duration: number) {
    this.snackbar.open(message, action, {
      duration: duration
    });
  }
}
