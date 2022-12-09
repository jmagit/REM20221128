import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export class EventData {
  constructor(private name: string, private value?: any) {
    this.name = name;
    this.value = value;
  }
  public get Name() { return this.name }
  public get Value() { return this.value }
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject$ = new Subject<EventData>();

  emit(event: EventData): void;
  emit(name: string, value?: any): void;
  emit(eventOrName: EventData | string, value?: any): void {
    if (eventOrName instanceof EventData) {
      this.subject$.next(eventOrName);
    } else {
      this.subject$.next(new EventData(eventOrName ?? '', value))
    }
  }

  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter((e: EventData) => e.Name === eventName),
      map((e: EventData) => e.Value)
    ).subscribe(action);
  }
}
