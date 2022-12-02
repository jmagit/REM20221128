import { Component, Injectable, DoCheck, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AjaxWaitService {
  private cont: number = 0;

  public get Visible() { return this.cont > 0; }
  public get Oculto() { return !this.Visible; }

  public Mostrar(): void { this.cont++; }
  public Ocultar(): void {
    if (this.cont > 0) { this.cont--; }
  }
}

// { provide: HTTP_INTERCEPTORS, useClass: AjaxWaitInterceptor, multi: true, },
@Injectable({ providedIn: 'root' })
export class AjaxWaitInterceptor implements HttpInterceptor {
  constructor(private srv: AjaxWaitService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.srv.Mostrar();
    return next.handle(req)
      .pipe(
        finalize(() => this.srv.Ocultar())
      );
  }
}
export function ajaxWaitInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const srv: AjaxWaitService = inject(AjaxWaitService);
  srv.Mostrar();
  return next(req)
    .pipe(
      finalize(() => srv.Ocultar())
    );
}

@Component({
  selector: 'app-ajax-wait',
  standalone: true,
  template: `
  <div [hidden]="Oculto">
    <div class="ajax-wait"></div>
    <img src="assets/loading.gif">
  </div>`,
  styles: [`
    .ajax-wait {
      position: fixed;
      background-color: black;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.3;
      z-index:100;
    }
    img {
      position: fixed;
      left: 45%;
      top: 45%;
      width: 10%;
      height: auto;
      opacity: 1;
      z-index:101;
    }
  `],
})
export class AjaxWaitComponent implements DoCheck {
  private oculto = true;
  constructor(private srv: AjaxWaitService) { }
  public get Visible() { return !this.oculto; }
  public get Oculto() { return this.oculto; }
  // public get Oculto() { return this.srv.Oculto; }
  ngDoCheck(): void {
    this.oculto = this.srv.Oculto;
  }
}
