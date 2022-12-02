import { Route } from '@angular/router';
import GraficoSvgComponent from './grafico-svg/grafico-svg.component';

export const ADMIN_ROUTES: Route[] = [
  // { path: 'falsa', loadComponent: () => import('./grafico-svg/grafico-svg.component'), },
  { path: '', component: GraficoSvgComponent, },
];
