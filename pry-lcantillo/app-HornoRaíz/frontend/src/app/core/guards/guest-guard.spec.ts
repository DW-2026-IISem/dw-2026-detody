import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { guestGuard } from './guest-guard';
import { SessionStore } from '../services/session-store';

describe('guestGuard', () => {
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

  it('debe permitir acceso al login si no está autenticado', () => {
    const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('debe redirigir a /dashboard si ya está autenticado', () => {
    sessionStore.setTokens({
      access_token: 'acc-token',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'ref-token',
      refresh_expires_in: 604800,
    });

    const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
    expect(result).not.toBe(true);
    expect(result.toString()).toContain('/dashboard');
  });
});
