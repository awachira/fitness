import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from './training.service';

import { Subscription } from 'rxjs/Subscription';

import { Exercise } from './exercise.model';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  trainingSub: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.trainingSub = this.trainingService.exerciseChanged
          .subscribe((ex: Exercise) => {
            if (ex) {
              this.ongoingTraining = true;
            } else {
              this.ongoingTraining = false;
            }
          });
  }
  ngOnDestroy() {
    this.trainingSub.unsubscribe();
  }
}
