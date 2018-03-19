import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { TrainingService } from '../training.service';

import { Exercise } from '../exercise.model';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  trainings: Array<Exercise>;
  exercisesSubscription: Subscription;
  isLoading$: Observable<boolean>;
  private dataLoadingSub: Subscription;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.dataLoadingSub = this.uiService
    //         .dataLoadingStateChanged
    //         .subscribe(isLoading => this.isLoading = isLoading);
    this.exercisesSubscription = this.trainingService.exercisesChanged
            .subscribe(exercises => this.trainings = exercises);
    this.fetchExercises();
  }

  ngOnDestroy() {
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
    // if (this.dataLoadingSub) {
    //   this.dataLoadingSub.unsubscribe();
    // }
  }

  onStartTraining(form: NgForm) {
    this.trainingService.setActiveExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchActiveExercise();
  }
}
