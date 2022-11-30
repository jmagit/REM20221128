import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { ContactosAddComponent, ContactosEditComponent, ContactosListComponent, ContactosViewComponent } from './contactos';
import { AuthGuard, InRoleGuard, RegisterUserComponent } from './security';
import { HomeComponent, PageNotFoundComponent } from './main';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { DemosComponent } from './demos/demos.component';
import { BlogListComponent, BlogAddComponent, BlogEditComponent, BlogViewComponent } from './blog';

function htmlFiles(url: UrlSegment[]) {
  return url.length === 1 && url[0].path.endsWith('.html') ? ({consumed: url}) : null;
}

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'inicio', component: HomeComponent },
  { path: 'demos', component: DemosComponent, title: 'Demos de componentes'  },
  { matcher: htmlFiles, component: DemosComponent, title: 'Demos de matcher' },
  { path: 'chisme/de/hacer/numeros', component: CalculadoraComponent, data: { pageTitle: 'Calculadora' } },
  { path: 'contactos', component: ContactosListComponent, data: { pageTitle: 'Contactos' } },
  { path: 'contactos/add', component: ContactosAddComponent, canActivate: [AuthGuard] },
  { path: 'contactos/:id/edit', component: ContactosEditComponent, canActivate: [AuthGuard] },
  { path: 'contactos/:id', component: ContactosViewComponent },
  { path: 'contactos/:id/:kk', component: ContactosViewComponent },
  { path: 'alisha/passion', redirectTo: '/contactos/9' },
  // {
  //   path: 'blog', children: [
  //     { path: '', component: BlogListComponent },
  //     { path: 'add', component: BlogAddComponent },
  //     { path: ':id/edit', component: BlogEditComponent },
  //     { path: ':id', component: BlogViewComponent },
  //     { path: ':id/:kk', component: BlogViewComponent },
  //   ], title: 'Blog'
  // },
  { path: 'blog', loadChildren: () => import('./blog').then(mod => mod.BlogModule)},
  {
    path: 'config', loadChildren: () => import('./config/config.module'),
    // path: 'config', loadChildren: () => import('./config/config.module').then(mod => mod.ConfigModule),
    canLoad: [InRoleGuard], data: { roles: ['Administradores', 'ADMIN'] }
  },

  // { path: 'falsa', loadComponent: () => import('./grafico-svg/grafico-svg.component'), },
  {path: 'falsa', loadChildren: () => import('./rutas').then(mod => mod.ADMIN_ROUTES)},

  { path: 'registro', component: RegisterUserComponent },
  { path: '404.html', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
