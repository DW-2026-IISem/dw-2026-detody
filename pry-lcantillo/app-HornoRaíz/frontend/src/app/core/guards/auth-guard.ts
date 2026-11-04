import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';

export const authGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (!session.authEnabled || session.isAuthenticated()) {
    return true;
  }

  const returnUrl = state.url.startsWith('/') && !state.url.startsWith('/login') ? state.url : '/dashboard';
  return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
};
