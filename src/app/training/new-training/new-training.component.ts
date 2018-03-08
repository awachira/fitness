import { Component, OnInit, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  @Output() trainingStart = new EventEmitter<void>();
  trainings = [
    {value: 'crunches', name: 'Crunches'},
    {value: 'touch-toes', name: 'Touch toes'},
    {value: 'side-lunges', name: 'Side Lunges'},
    {value: 'burpees', name: 'Burpees'}
  ];
  constructor() { }

  ngOnInit() {
  }

  onStartTraining() {
    this.trainingStart.emit();
  }
}
