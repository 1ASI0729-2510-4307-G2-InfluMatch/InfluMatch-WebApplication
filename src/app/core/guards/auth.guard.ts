import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userInfo = localStorage.getItem('user');

  // If there's no user info, redirect to login
  if (!userInfo) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userInfo = localStorage.getItem('user');

  // If there's user info, redirect to dashboard or profile setup
  if (userInfo) {
    const user = JSON.parse(userInfo);
    const route = user.hasProfile ? '/dashboard' : '/profile-setup';
    router.navigate([route]);
    return false;
  }

  return true;
}; 