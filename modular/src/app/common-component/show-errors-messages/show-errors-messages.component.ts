import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ErrorMessagePipe } from '@my/core';

@Component({
  selector: 'app-show-errors-messages',
  templateUrl: './show-errors-messages.component.html',
  styleUrls: ['./show-errors-messages.component.css']
})
export class ShowErrorsMessagesComponent implements OnChanges  {
  @Input() errors: any;

  mensaje = '';
  hidden = false;

  private pipe = new ErrorMessagePipe();

  ngOnChanges(_changes: SimpleChanges): void {
    this.mensaje = this.errors ? this.pipe.transform(this.errors) : ''
    this.hidden = this.mensaje === '';
  }

}
