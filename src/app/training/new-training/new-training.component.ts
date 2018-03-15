import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';

import { TrainingService } from '../training.service';

import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  trainings: Array<Exercise>;
  exercisesSubscription: Subscription;

  constructor(
    private trainingService: TrainingService
  ) { }

  ngOnInit() {
    this.exercisesSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => this.trainings = exercises);
    this.trainingService.fetchActiveExercise();
  }

  ngOnDestroy() {
    this.exercisesSubscription.unsubscribe();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.setActiveExercise(form.value.exercise);
  }
}
