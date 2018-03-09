import { Component, OnInit } from '@angular/core';

import { TrainingService } from '../training.service';

import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  // @Output() trainingStart = new EventEmitter<void>();
  trainings = new Array<Exercise>();

  constructor(
    private trainingService: TrainingService
  ) { }

  ngOnInit() {
    const sub = this.trainingService
                  .getExercises()
                  .subscribe(exercise => this.trainings.push(exercise));
    sub.unsubscribe();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.setActiveExercise(form.value.exercise);
  }
}
