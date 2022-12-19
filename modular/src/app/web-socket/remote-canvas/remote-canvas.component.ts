import { AfterViewInit, Component, ElementRef, HostListener, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../web-socket.services';

@Injectable({
  providedIn: 'root'
})
export class DrawWebSocketService extends WebSocketService {
  constructor() {
    super('draw')
  }
}

interface Message {
  color: string,
  x: number,
  y: number,

}

@Component({
  selector: 'app-remote-canvas',
  templateUrl: './remote-canvas.component.html',
  styleUrls: ['./remote-canvas.component.css']
})
export class RemoteCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef?: ElementRef;
  private cx?: CanvasRenderingContext2D;
  private rect: any;
  private isCapturing = false;
  protected cache: Array<Message> = [];
  protected color = '#' + Math.floor(Math.random()*16777215).toString(16);
  protected notify = ''
  private subscription: Subscription | undefined

  constructor(private wss: DrawWebSocketService) {}

  ngAfterViewInit(): void {
    if (!this.canvasRef) return
    const nativeElement = this.canvasRef.nativeElement;
    this.cx = nativeElement.getContext('2d');
    if (!this.cx) return
    this.rect = nativeElement.getBoundingClientRect();
    this.cx.lineCap = 'round';
    this.cx.lineWidth = 2;
    this.connect()
  }

  connect() {
    this.subscription = this.wss.connect('', {
      openObserver: { next: () => this.notify = 'Conexión establecida' },
      closingObserver: { next: () => this.notify = '[DataService]: connection closing' },
      closeObserver: {
        next: event => {
          this.notify = `Conexión cerrada ${event.wasClean ? 'limpiamente' : 'con problemas'}.`
        }
      },
      reconnect: true
    }).subscribe({
      next: data => this.received(data),
      error: event => {
        this.notify = `ERROR: código: ${event.code}${event.reason ? ` motivo=${event.reason}` : ''}.`
      },
    })
  }

  onMouseMove(ev: MouseEvent) {
    if (this.isCapturing) {
      this.send(ev);
    }
  }

  onClick(ev: MouseEvent) {
    this.isCapturing = !this.isCapturing;
    this.send(ev);
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  clear() {
    this.cache = [];
    if (!this.canvasRef || !this.cx) return;
    this.cx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }

  private send(ev: MouseEvent) {
    const message = {
      color: this.color,
      x: ev.clientX - this.rect.left,
      y: ev.clientY - this.rect.top,
    }
    this.wss.sendMessage(message)
  }

  private received(message: Message) {
    if (this.cache.length >= 2)
      this.cache.splice(0, 1)
    this.cache.push(message);
    this.notify = 'Recibido: ' + JSON.stringify(message)
    if (this.cache.length > 1) {
      this.draw(this.cache[this.cache.length - 2], this.cache[this.cache.length - 1]);
    }
  }

  private draw(start: Message, end: Message) {
    if (!this.cx) return;
    this.cx.beginPath();

    if (start) {
      this.cx.strokeStyle = start.color;
      this.cx.moveTo(start.x, start.y);
      this.cx.lineTo(end.x, end.y);
      this.cx.stroke();
    }
  }
}
