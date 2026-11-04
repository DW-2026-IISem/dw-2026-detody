import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { authOnlyGuard } from './auth-only-guard';
import { SessionStore } from '../services/session-store';

describe('authOnlyGuard', () => {
  let sessionStore: SessionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    sessionStore = TestBed.inject(SessionStore);
  });

  it('debe permitir acceso cuando authEnabled es true (Fase II)', () => {
    const result = TestBed.runInInjectionContext(() => authOnlyGuard({} as any, {} as any));
    expect(result).toBe(true);
  });
});
