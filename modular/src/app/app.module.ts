import { LOCALE_ID, NgModule } from '@angular/core';
import { DATE_PIPE_DEFAULT_OPTIONS, NgOptimizedImage, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';
registerLocaleData(localeEs, 'es', localeEsExtra);

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ERROR_LEVEL, LoggerService, MyCoreModule } from '@my/core';
import { CommonComponentModule } from './common-component';
import { CommonServicesModule } from './common-services';
import { ContactosModule } from './contactos';
import { AuthInterceptor, SecurityModule } from './security';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AjaxWaitInterceptor, MainModule } from './main';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { DemosComponent, SvgComponent } from './demos/demos.component';

@NgModule({
  declarations: [
    AppComponent, CalculadoraComponent, DemosComponent, SvgComponent,
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, NgOptimizedImage,
    AppRoutingModule, MainModule, SecurityModule, MyCoreModule, CommonServicesModule,
    CommonComponentModule, ContactosModule,
  ],
  providers: [
    LoggerService,
    { provide: ERROR_LEVEL, useValue: environment.ERROR_LEVEL },
    { provide: LOCALE_ID, useValue: 'es-ES'},
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { dateFormat: 'dd/MMM/yy' } },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: AjaxWaitInterceptor, multi: true, },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
