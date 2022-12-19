import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { RemoteCanvasComponent } from './remote-canvas/remote-canvas.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';


@NgModule({
  declarations: [ ChatComponent, RemoteCanvasComponent, DashboardComponent, ],
  exports: [ ChatComponent, RemoteCanvasComponent, DashboardComponent, ],
  imports: [
    CommonModule, FormsModule, ChartModule, CardModule,
  ]
})
export class WebSocketModule { }
