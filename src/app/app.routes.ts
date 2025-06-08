import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadChildren: () => import('./features/register/presentation/register.routes').then(m => m.registerRoutes),
  },
];