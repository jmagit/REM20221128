import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent, AjaxWaitComponent, HeaderComponent, NotificationModalComponent } from './components/main';
import { NavigationService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HeaderComponent, NotificationModalComponent, AjaxWaitComponent, RouterOutlet, ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private nav: NavigationService) {}
}
