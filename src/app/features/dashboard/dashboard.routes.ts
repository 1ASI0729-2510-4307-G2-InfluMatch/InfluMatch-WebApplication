import type { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./pages/profile-detail/profile-detail.component').then(
        (m) => m.ProfileDetailComponent
      ),
  },
];
