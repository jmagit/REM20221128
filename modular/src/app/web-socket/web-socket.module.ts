import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { RemoteCanvasComponent } from './remote-canvas/remote-canvas.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ ChatComponent, RemoteCanvasComponent, ],
  exports: [ ChatComponent, RemoteCanvasComponent, ],
  imports: [
    CommonModule, FormsModule,
  ]
})
export class WebSocketModule { }
