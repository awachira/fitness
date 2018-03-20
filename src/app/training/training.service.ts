import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Exercise } from './exercise.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators';

import { UIEventsService } from '../services/uievents.service';

import { Store } from '@ngrx/store';

import * as Training from './training.action';
import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {
  private fireSubs = new Array<Subscription>();

  constructor(
    private fireDB: AngularFirestore,
    private uiServices: UIEventsService,
    private store: Store<fromTraining.State>
  ) { }

  setActiveExercise(activExerId: string) {
    this.store.dispatch(new Training.StartTraining(activExerId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100 ),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  fetchActiveExercise(): void {
    this.store.dispatch(new UI.StartLoading());
    this.fireSubs.push(
    this.fireDB
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          };
        });
      })
      .subscribe((exercises: Array<Exercise>) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiServices.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
      })
    );
  }

  fetchAllExercises(): void {
    this.store.dispatch(new UI.StartLoading());
    this.fireSubs.push(
    this.fireDB.collection('finishedExercises')
      .valueChanges()
      .subscribe(
        (exercises: Array<Exercise>) => {
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    this.fireDB.collection('finishedExercises')
      .add(exercise);
  }

  cancelFireSubscriptions() {
    this.fireSubs.forEach(sub => sub.unsubscribe());
  }
}
