import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [ NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgForOf, ],
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent {

  constructor(private vm: NotificationService) { }

  public get VM() { return this.vm; }

}
