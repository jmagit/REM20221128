import { NgIf, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationService } from 'src/app/services';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {

  constructor(private vm: NotificationService) { }

  public get VM() { return this.vm; }

}
