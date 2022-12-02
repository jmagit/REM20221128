import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { environment } from './environments/environment';
import { ERROR_LEVEL } from './app/services';
import { ajaxWaitInterceptor, AjaxWaitInterceptor } from './app/components/main';
import { AuthInterceptor } from './app/security';

bootstrapApplication(AppComponent,  {
  providers: [
    { provide: ERROR_LEVEL, useValue: environment.ERROR_LEVEL },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, },
    // { provide: HTTP_INTERCEPTORS, useClass: AjaxWaitInterceptor, multi: true, },
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([ajaxWaitInterceptor])),
    // provideHttpClient(withInterceptors([AuthInterceptor])),
  ]
});

// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';

// import { AppComponent } from './app.component';

// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
