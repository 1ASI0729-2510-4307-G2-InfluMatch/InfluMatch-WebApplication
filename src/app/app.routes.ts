import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes
  {
    path: 'login',
    loadComponent: () => import('./features/login/presentation/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/presentation/register.component').then(m => m.RegisterComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'profile-setup',
    loadComponent: () => import('./features/profile-setup/presentation/profile-setup.component').then(m => m.ProfileSetupComponent),
    canActivate: [authGuard]
  },

  // Protected routes with layout
  {
    path: '',
    loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/presentation/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'campaigns',
        loadComponent: () => import('./features/campaigns/presentation/campaigns.component').then(m => m.CampaignsComponent)
      },
      {
        path: 'messages',
        loadComponent: () => import('./features/messages/presentation/messages.component').then(m => m.MessagesComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/presentation/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // Catch all route for non-existing paths
  { path: '**', redirectTo: 'login' }
];
