import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Exercise } from './exercise.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { UIEventsService } from '../services/uievents.service';

import { Store } from '@ngrx/store';

import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Array<Exercise>>();
  finishedExercisesChanged = new Subject<Array<Exercise>>();

  private fireSubs = new Array<Subscription>();

  private availableExercises: Array<Exercise>;
  private activeExercise: Exercise;

  constructor(
    private fireDB: AngularFirestore,
    private uiServices: UIEventsService,
    private store: Store<fromRoot.State>
  ) { }

  setActiveExercise(activExerId: string) {
    this.activeExercise = this.availableExercises.find(ex => ex.id === activExerId);
    this.exerciseChanged.next(this.getActiveExercise());
  }

  completeExercise() {
    this.addDataToDatabase({...this.activeExercise,
      date: new Date(),
    state: 'completed'});
    this.activeExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({...this.activeExercise,
      duration: this.activeExercise.duration * (progress / 100),
      calories: this.activeExercise.calories * (progress / 100 ),
      date: new Date(),
      state: 'cancelled'});
    this.activeExercise = null;
    this.exerciseChanged.next(null);
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
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.exercisesChanged.next(null);
        this.uiServices.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
      })
    );
  }

  getActiveExercise(): Exercise {
    return {...this.activeExercise};
  }
  getExercises(): Observable<Exercise> {
    return Observable.from(this.availableExercises);
  }
  fetchAllExercises(): void {
    this.store.dispatch(new UI.StartLoading());
    this.fireSubs.push(
    this.fireDB.collection('finishedExercises')
      .valueChanges()
      .subscribe(
        (exercises: Array<Exercise>) => {
          this.store.dispatch(new UI.StopLoading());
          this.finishedExercisesChanged.next(exercises);
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
