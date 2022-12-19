import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { ContactosAddComponent, ContactosEditComponent, ContactosListComponent, ContactosViewComponent } from './contactos';
import { AuthGuard, AuthService, InRoleGuard, LoginFormComponent, RegisterUserComponent } from './security';
import { HomeComponent, PageNotFoundComponent } from './main';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { DemosComponent } from './demos/demos.component';
import { ChatComponent, RemoteCanvasComponent } from './web-socket';

function htmlFiles(url: UrlSegment[]) {
  return url.length === 1 && url[0].path.endsWith('.html') ? ({consumed: url}) : null;
}

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'inicio', component: HomeComponent },
  { path: 'demos', component: DemosComponent, title: 'Demos de componentes'  },
  { path: 'chisme/de/hacer/numeros', component: CalculadoraComponent, data: { pageTitle: 'Calculadora' } },
  { path: 'contactos', component: ContactosListComponent, data: { pageTitle: 'Contactos' } },
  { path: 'contactos/add', component: ContactosAddComponent, canActivate: [AuthGuard] },
  { path: 'contactos/:id/edit', component: ContactosEditComponent, canActivate: [AuthGuard] },
  { path: 'contactos/:id', component: ContactosViewComponent },
  { path: 'contactos/:id/:kk', component: ContactosViewComponent },
  { path: 'alisha/passion', redirectTo: '/contactos/443' },
  { path: 'chat', component: ChatComponent, data: { pageTitle: 'Chat' } },
  { path: 'canvas', component: RemoteCanvasComponent, title: 'Canvas' },
  // {
  //   path: 'blog', children: [
  //     { path: '', component: BlogListComponent },
  //     { path: 'add', component: BlogAddComponent },
  //     { path: ':id/edit', component: BlogEditComponent },
  //     { path: ':id', component: BlogViewComponent },
  //     { path: ':id/:kk', component: BlogViewComponent },
  //   ], title: 'Blog'
  // },
  { path: 'blog', loadChildren: () => import('./blog').then(mod => mod.BlogModule), canActivate: [AuthGuard], data: { redirectTo: '/login'}, /*canDeactivate: [() => inject(AuthService). isAutenticated],*/ },
  {
    path: 'config', loadChildren: () => import('./config/config.module'),
    // path: 'config', loadChildren: () => import('./config/config.module').then(mod => mod.ConfigModule),
    canLoad: [InRoleGuard], data: { roles: ['Administradores', 'ADMIN'] }
  },
  // { path: 'falsa', loadComponent: () => import('./grafico-svg/grafico-svg.component'), },
  // { path: 'falsa', loadChildren: () => import('./rutas').then(mod => mod.ADMIN_ROUTES), },
  { path: 'login', component: LoginFormComponent },
  { path: 'registro', component: RegisterUserComponent },
  { path: '404.html', component: PageNotFoundComponent },
  { matcher: htmlFiles, component: DemosComponent, title: 'Demos de matcher' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes/*, { onSameUrlNavigation: 'reload' }*/)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
