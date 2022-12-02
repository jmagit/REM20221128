import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
        <H1>{{ header }}</H1>
        <ng-content></ng-content>
    </div>
  `
})

export class CardComponent {
  @Input() header: string = 'this is header';
}
