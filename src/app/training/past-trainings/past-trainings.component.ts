import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

import { Subscription } from 'rxjs/Subscription';
import { UIEventsService } from '../../services/uievents.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent
 implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: Array<string> = [
    'date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exercisesChangedSub: Subscription;
  isLoading = false;
  private dataLoadingSub: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIEventsService
  ) { }

  ngOnInit() {
    this.dataLoadingSub = this.uiService
      .dataLoadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.exercisesChangedSub = this.trainingService
      .finishedExercisesChanged
      .subscribe((exercises: Array<Exercise>) => {
        this.dataSource.data = exercises;
      });
    this.trainingService.fetchAllExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.exercisesChangedSub) {
      this.exercisesChangedSub.unsubscribe();
    }
    if (this.dataLoadingSub) {
      this.dataLoadingSub.unsubscribe();
    }
  }
  /**
   *
   * @param filterValue :string Filter rows using this string.
   */
  doFilter(filterValue: string) {
    // setting 'filterPredicate' to a function that takes two arguments (data object representing the data of one row,
    // and the filtering string)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
