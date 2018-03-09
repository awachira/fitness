import { Exercise } from './exercise.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { Subject } from 'rxjs/Subject';

export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  private availableExercises: Array<Exercise> = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];
  private activeExercise: Exercise;
  private exercises = new Array<Exercise>();

  setActiveExercise(activExerId: string) {
    this.activeExercise = this.availableExercises.find(ex => ex.id === activExerId);
    this.exerciseChanged.next(this.getActiveExercise());
  }

  completeExercise() {
    this.exercises.push({...this.activeExercise,
      date: new Date(),
    state: 'completed'});
    this.activeExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({...this.activeExercise,
      duration: this.activeExercise.duration * (progress / 100),
      calories: this.activeExercise.calories * (progress / 100 ),
      date: new Date(),
      state: 'cancelled'});
    this.activeExercise = null;
    this.exerciseChanged.next(null);
  }

  getActiveExercise(): Exercise {
    return {...this.activeExercise};
  }
  getExercises(): Observable<Exercise> {
    return Observable.from(this.availableExercises);
  }
  getAllExercises(): Array<Exercise> {
    return this.exercises.slice();
  }
}
