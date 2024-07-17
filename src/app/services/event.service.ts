import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventSubject = new Subject<void>();

  event$ = this.eventSubject.asObservable();

  triggerEvent() {
    this.eventSubject.next();
  }
}
