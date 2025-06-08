import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/login/presentation/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/presentation/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'profile-setup',
    loadComponent: () => import('./features/profile-setup/presentation/profile-setup.component').then(m => m.ProfileSetupComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/presentation/dashboard.component').then(m => m.DashboardComponent)
  }
];
