import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth-guard';
import { SessionStore } from '../services/session-store';

describe('authGuard', () => {
  let sessionStore: SessionStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    sessionStore = TestBed.inject(SessionStore);
    router = TestBed.inject(Router);
    sessionStore.clear();
  });

  it('debe permitir acceso si el usuario está autenticado', () => {
    sessionStore.setTokens({
      access_token: 'acc-token',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'ref-token',
      refresh_expires_in: 604800,
    });

    const state = { url: '/clientes' } as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, state));

    expect(result).toBe(true);
  });

  it('debe redirigir a /login con returnUrl si no está autenticado', () => {
    const state = { url: '/ventas' } as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, state));

    expect(result).not.toBe(true);
    expect(result.toString()).toContain('/login?returnUrl=%2Fventas');
  });
});
