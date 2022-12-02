import { Route } from '@angular/router';
import { AuthGuard } from '../security';
import { ContactosAddComponent } from './componente.add.component';
import { ContactosEditComponent } from './componente.edit.component';
import { ContactosListComponent } from './componente.list.component';
import { ContactosViewComponent } from './componente.view.component';

export const routes: Route[] = [
  { path: '', component: ContactosListComponent, data: { pageTitle: 'Contactos' } },
  { path: 'add', component: ContactosAddComponent, canActivate: [AuthGuard] },
  { path: ':id/edit', component: ContactosEditComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ContactosViewComponent },
  { path: ':id/:kk', component: ContactosViewComponent },
];
