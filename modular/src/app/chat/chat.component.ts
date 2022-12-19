import { Component, OnInit, Injectable, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NotificationService } from '../common-services';
import { ContactosDAOService } from '../contactos/servicios.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { catchError, EMPTY, NextObserver, Observable, retry, Subject, Subscription, switchAll, tap, timeout, timer } from 'rxjs';
import { WebSocketMessage } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { TitleCasePipe } from '@angular/common';
import { CapitalizePipe } from '@my/core';

export const WS_ENDPOINT = environment.wsEndpoint + 'chat';
export const RECONNECT_INTERVAL = 1000
export const RECONNECT_INCREMENT = 5
export const RECONNECT_MAX_RETRY = 10

export interface RemoteWebServiceConfig<T> {
  /**
   * A serializer used to create messages from passed values before the
   * messages are sent to the server. Defaults to JSON.stringify.
   */
  serializer?: (value: T) => WebSocketMessage;
  /**
   * A deserializer used for messages arriving on the socket from the
   * server. Defaults to JSON.parse.
   */
  deserializer?: (e: MessageEvent) => T;
  /**
   * An Observer that watches when open events occur on the underlying web socket.
   */
  openObserver?: NextObserver<Event>;
  /**
   * An Observer that watches when close events occur on the underlying web socket
   */
  closeObserver?: NextObserver<CloseEvent>;
  /**
   * An Observer that watches when a close is about to occur due to
   * unsubscription.
   */
  closingObserver?: NextObserver<void>;
  /**
  * When the connection is lost, the socket will be closed and the WebSocketSubjet
  * will no longer emit values. This is not the expected behaviour in the real time
  * world. The reconnection capability is a must in most cases.
  */
  reconnect?: boolean
}

export abstract class WebSocketService {
  private socket$?: WebSocketSubject<any>;
  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$.pipe<any, any>(
    switchAll(),
    catchError(e => { throw e })
  );
  private clientId: number | string = '';
  private config?: RemoteWebServiceConfig<any>;
  serializer?: (value: any) => WebSocketMessage;
  deserializer?: (e: MessageEvent) => any;
  openObserver?: NextObserver<Event>;
  closeObserver?: NextObserver<CloseEvent>;
  closingObserver?: NextObserver<void>;

  public connect(clientId: number | string, config?: RemoteWebServiceConfig<any>) {
    this.close();
    this.clientId = clientId
    this.config = config
    this.socket$ = this.getNewWebSocket();
    if (this.config?.reconnect) {
      return this.socket$.pipe(
        retry({
          count: RECONNECT_MAX_RETRY, delay(error, retryCount) {
            console.log('[Data Service] Try to reconnect', error)
            return timer(retryCount * 3 * RECONNECT_INTERVAL)
          }, resetOnSuccess: true
        }),
        tap({
          error: error => console.log('Tap error', error),
        }),
        catchError(() => EMPTY)
      );
    } else {
      return this.socket$
    }
  }

  private getNewWebSocket() {
    const config = {
      url: this.clientId === '' ? WS_ENDPOINT : `${WS_ENDPOINT}/${this.clientId}`,
      ...this.config
    }
    if (this.serializer && !config.serializer) config.serializer = this.serializer
    if (this.deserializer && !config.deserializer) config.deserializer = this.deserializer
    if (this.openObserver && !config.openObserver) config.openObserver = this.openObserver
    if (this.closeObserver && !config.closeObserver) config.closeObserver = this.closeObserver
    if (this.closingObserver && !config.closingObserver) config.closingObserver = this.closingObserver

    return webSocket(config);
  }

  sendMessage(msg: any) {
    if (this.socket$) this.socket$.next(msg);
  }

  close() {
    if (this.socket$) this.socket$.complete();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService extends WebSocketService {
}

interface Usuario {
  userId: number
  fecha: Date
  datos: { [index: string]: any }
}

interface Mensaje {
  clientId: number
  message: string
  fecha: Date
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  readonly palabras = "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.".split(" ")
  readonly capitalize = new CapitalizePipe()
  private subscription: Subscription | undefined

  userId = 0
  usuario: Usuario | undefined
  usuarios = [
    { "id": 0, "nombre": "SERVIDOR", "apellidos": 'CHAT', "avatar": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tISBGb250IEF3ZXNvbWUgRnJlZSA2LjIuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIChJY29uczogQ0MgQlkgNC4wLCBGb250czogU0lMIE9GTCAxLjEsIENvZGU6IE1JVCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD0iTTI1NiA1MTJjMTQxLjQgMCAyNTYtMTE0LjYgMjU2LTI1NlMzOTcuNCAwIDI1NiAwUzAgMTE0LjYgMCAyNTZTMTE0LjYgNTEyIDI1NiA1MTJ6bTAtMzg0YzEzLjMgMCAyNCAxMC43IDI0IDI0VjI2NGMwIDEzLjMtMTAuNyAyNC0yNCAyNHMtMjQtMTAuNy0yNC0yNFYxNTJjMC0xMy4zIDEwLjctMjQgMjQtMjR6bTMyIDIyNGMwIDE3LjctMTQuMyAzMi0zMiAzMnMtMzItMTQuMy0zMi0zMnMxNC4zLTMyIDMyLTMyczMyIDE0LjMgMzIgMzJ6Ii8+PC9zdmc+" },
  ]
  mensajes = new Array<Mensaje>()
  mensaje = ''
  @ViewChild('messagesRef') messagesRef?: ElementRef;

  constructor(private dao: ContactosDAOService, private wss: ChatWebSocketService, private notify: NotificationService) { }

  get Usuarios() { return this.usuarios.filter(item => item.id !== 0) }
  conMensajes(userId: number) {
    return this.mensajes.find(item => item.clientId === userId) !== undefined
  }

  ngOnInit(): void {
    this.dao.query().subscribe({
      next: list => {
        this.usuarios = [
          { "id": 0, "nombre": "SERVIDOR", "apellidos": 'CHAT', "avatar": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tISBGb250IEF3ZXNvbWUgRnJlZSA2LjIuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIChJY29uczogQ0MgQlkgNC4wLCBGb250czogU0lMIE9GTCAxLjEsIENvZGU6IE1JVCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD0iTTI1NiA1MTJjMTQxLjQgMCAyNTYtMTE0LjYgMjU2LTI1NlMzOTcuNCAwIDI1NiAwUzAgMTE0LjYgMCAyNTZTMTE0LjYgNTEyIDI1NiA1MTJ6bTAtMzg0YzEzLjMgMCAyNCAxMC43IDI0IDI0VjI2NGMwIDEzLjMtMTAuNyAyNC0yNCAyNHMtMjQtMTAuNy0yNC0yNFYxNTJjMC0xMy4zIDEwLjctMjQgMjQtMjR6bTMyIDIyNGMwIDE3LjctMTQuMyAzMi0zMiAzMnMtMzItMTQuMy0zMi0zMnMxNC4zLTMyIDMyLTMyczMyIDE0LjMgMzIgMzJ6Ii8+PC9zdmc+" },
          ...list
        ]
      }
    })
  }

  connect(userId: number) {
    this.usuario = { userId, fecha: new Date(), datos: this.usuarios[userId] }
    this.subscription = this.wss.connect(userId, {
      openObserver: { next: () => this.add(0, 'Conexión establecida') },
      closingObserver: { next: () => this.add(0, '[DataService]: connection closing') },
      closeObserver: {
        next: event => {
          this.add(0, `Conexión cerrada ${event.wasClean ? 'limpiamente' : 'con problemas'}.`)
          console.log('[Data Service] Close', event)
        }
      },
      reconnect: true
    }).subscribe({
      next: data => this.add(data?.clientId, data?.message),
      error: event => {
        this.add(0, `ERROR: código: ${event.code}${event.reason ? ` motivo=${event.reason}` : ''}.`)
        console.log('[Data Service] ERROR', event)
      },
      // complete: () => this.add(0, `Conexión cerrada. `)
    })
  }

  send() {
    if (this.usuario) {
      const msg = this.mensaje === '' ? this.generaFrase() : this.mensaje
      this.add(this.usuario?.userId, msg)
      this.wss.sendMessage(msg)
      if (this.mensaje) this.mensaje = ''
    }
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
  private add(clientId: number, message: string) {
    this.mensajes.push({ clientId, message, fecha: new Date() })
    if (this.messagesRef) {
      const el = this.messagesRef.nativeElement as HTMLElement
      setTimeout(() => el.scrollTo(0, el.scrollHeight), 0)
    }
  }
  private generaFrase() {
    const num = 1 + Math.floor(Math.random() * (this.palabras.length - 1))
    let frase = ''
    for (let i = 0; i <= num; i++)
      frase += this.palabras[Math.floor(Math.random() * (this.palabras.length - 1))] + ' '
    return this.capitalize.transform(frase.trim() + '.')
  }
}
