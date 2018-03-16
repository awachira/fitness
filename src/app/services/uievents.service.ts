import { Subject } from 'rxjs/Subject';

export class UIEventsService {
  loadingStateChanged = new Subject<boolean>();
  dataLoadingStateChanged = new Subject<boolean>();
}
