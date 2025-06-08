import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.component').then(m => m.OnboardingComponent),
    canActivate: [AuthGuard]
  }
]; 