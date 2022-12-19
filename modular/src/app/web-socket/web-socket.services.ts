import { NextObserver, Subject, switchAll, catchError, retry, timer, tap, EMPTY } from 'rxjs';
import { WebSocketMessage } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

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
  readonly WS_ENDPOINT: string;
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

  constructor(channel: string) {
    this.WS_ENDPOINT = environment.wsEndpoint + channel;
  }

  public connect(clientId: number | string = '', config?: RemoteWebServiceConfig<any>) {
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
      url: this.clientId === '' ? this.WS_ENDPOINT : `${this.WS_ENDPOINT}/${this.clientId}`,
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
