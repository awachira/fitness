import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { TrainingService } from '../training.service';

import { Exercise } from '../exercise.model';

import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  trainings$: Observable<Array<Exercise>>;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.trainings$ = this.store.select(fromTraining.getAvailableExercises);
    // this.dataLoadingSub = this.uiService
    //         .dataLoadingStateChanged
    //         .subscribe(isLoading => this.isLoading = isLoading);
    this.fetchExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.setActiveExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchActiveExercise();
  }
}
