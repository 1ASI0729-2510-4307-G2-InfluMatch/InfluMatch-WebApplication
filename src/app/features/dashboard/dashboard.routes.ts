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
      import('./presentation/pages/profile-details/profile-details.component').then(
        (m) => m.ProfileDetailsComponent
      ),
  },
  {
    path: 'collaborations',
    loadComponent: () =>
      import('./presentation/pages/collaborations-list/collaborations-list.component').then(
        (m) => m.CollaborationsListComponent
      ),
  },
  {
    path: 'collaborations/:id',
    loadComponent: () =>
      import('./presentation/pages/collaboration-details/collaboration-details.component').then(
        (m) => m.CollaborationDetailsComponent
      ),
  },
  {
    path: 'new-collaboration',
    loadComponent: () =>
      import('./presentation/pages/collaborations/collaborations.component').then(
        (m) => m.CollaborationsComponent
      ),
  },
  {
    path: 'agenda',
    loadComponent: () =>
      import('./presentation/pages/agenda/agenda.component').then(
        (m) => m.AgendaComponent
      ),
  },
];
