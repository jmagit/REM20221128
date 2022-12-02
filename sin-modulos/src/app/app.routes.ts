import { Routes } from '@angular/router';
import { HomeComponent, PageNotFoundComponent } from './components/main';
import { AuthGuard } from './security';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'inicio', component: HomeComponent },
  // { path: 'demos', component: DemosComponent, title: 'Demos de componentes'  },
  // { matcher: htmlFiles, component: DemosComponent, title: 'Demos de matcher' },
  { path: 'chisme/de/hacer/numeros', loadComponent: () => import('./components/calculadora/calculadora.component'), title: 'Calculadora' },
  // { path: 'contactos', loadChildren: () => import('./contactos').then(mod => mod.routes) },
  { path: 'contactos', children: [
    { path: '', loadComponent: () => import('./contactos/componente.list.component').then(cmp => cmp.ContactosListComponent), data: { pageTitle: 'Contactos' } },
    { path: 'add', loadComponent: () => import('./contactos/componente.add.component').then(cmp => cmp.ContactosAddComponent), canActivate: [AuthGuard] },
    { path: ':id/edit', loadComponent: () => import('./contactos/componente.edit.component').then(cmp => cmp. ContactosEditComponent), canActivate: [AuthGuard] },
    { path: ':id', loadComponent: () => import('./contactos/componente.view.component').then(cmp => cmp.ContactosViewComponent) },
    { path: ':id/:kk', loadComponent: () => import('./contactos/componente.view.component').then(cmp => cmp.ContactosViewComponent) },
  ] },
  { path: 'alisha/passion', redirectTo: '/contactos/9' },
  // { path: 'contactos', component: ContactosListComponent, data: { pageTitle: 'Contactos' } },
  // { path: 'contactos/add', component: ContactosAddComponent, canActivate: [AuthGuard] },
  // { path: 'contactos/:id/edit', component: ContactosEditComponent, canActivate: [AuthGuard] },
  // { path: 'contactos/:id', component: ContactosViewComponent },
  // { path: 'contactos/:id/:kk', component: ContactosViewComponent },
  // {
  //   path: 'blog', children: [
  //     { path: '', component: BlogListComponent },
  //     { path: 'add', component: BlogAddComponent },
  //     { path: ':id/edit', component: BlogEditComponent },
  //     { path: ':id', component: BlogViewComponent },
  //     { path: ':id/:kk', component: BlogViewComponent },
  //   ], title: 'Blog'
  // },
  // { path: 'blog', loadChildren: () => import('./blog').then(mod => mod.BlogModule)},
  // {
  //   path: 'config', loadChildren: () => import('./config/config.module'),
  //   // path: 'config', loadChildren: () => import('./config/config.module').then(mod => mod.ConfigModule),
  //   canLoad: [InRoleGuard], data: { roles: ['Administradores', 'ADMIN'] }
  // },

  // // { path: 'falsa', loadComponent: () => import('./grafico-svg/grafico-svg.component'), },
  // {path: 'falsa', loadChildren: () => import('./rutas').then(mod => mod.ADMIN_ROUTES)},

  { path: 'registro', loadComponent: () => import('./security/register-user/register-user.component'), title: 'Registro' },
  { path: '404.html', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];
