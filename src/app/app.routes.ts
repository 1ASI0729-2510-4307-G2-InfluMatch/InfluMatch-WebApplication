import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/presentation/login.routes').then(m => m.loginRoutes),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./features/register/presentation/register.routes').then(m => m.registerRoutes),
  },
  {
    path: 'profile-setup',
    loadChildren: () =>
      import('./features/profile-setup/presentation/profile-setup.routes')
        .then(m => m.profileSetupRoutes),
  },

];
