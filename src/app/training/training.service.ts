import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Exercise } from './exercise.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Array<Exercise>>();
  finishedExercisesChanged = new Subject<Array<Exercise>>();

  private availableExercises: Array<Exercise>;
  private activeExercise: Exercise;

  constructor(private fireDB: AngularFirestore) { }

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
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  getActiveExercise(): Exercise {
    return {...this.activeExercise};
  }
  getExercises(): Observable<Exercise> {
    return Observable.from(this.availableExercises);
  }
  fetchAllExercises(): void {
    this.fireDB.collection('finishedExercises')
      .valueChanges()
      .subscribe(
        (exercises: Array<Exercise>) => {
          this.finishedExercisesChanged.next(exercises);
        });
  }

  private addDataToDatabase(exercise: Exercise) {
    this.fireDB.collection('finishedExercises')
      .add(exercise);
  }
}
