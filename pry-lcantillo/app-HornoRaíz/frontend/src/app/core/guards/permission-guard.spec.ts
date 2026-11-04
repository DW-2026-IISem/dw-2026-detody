import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRouteSnapshot } from '@angular/router';
import { permissionGuard } from './permission-guard';
import { SessionStore } from '../services/session-store';

describe('permissionGuard', () => {
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

  it('debe permitir acceso si el usuario cuenta con el permiso requerido', () => {
    sessionStore.setAccess({
      user: { id: 1, username: 'admin', email: 'admin@hornoraiz.com', status: 'active' },
      permissions: [
        {
          resource_id: 1,
          method: 'GET',
          path: '/api/clientes',
          description: null,
          role_id: 1,
          role_name: 'ADMIN',
        },
      ],
    });

    const route = {
      data: { permission: 'GET /api/clientes' },
    } as unknown as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() => permissionGuard(route, {} as any));

    expect(result).toBe(true);
  });

  it('debe redirigir a /forbidden con queryParam si no tiene el permiso', () => {
    sessionStore.setAccess({
      user: { id: 2, username: 'seller', email: 'seller@hornoraiz.com', status: 'active' },
      permissions: [
        {
          resource_id: 1,
          method: 'GET',
          path: '/api/clientes',
          description: null,
          role_id: 2,
          role_name: 'SELLER',
        },
      ],
    });

    const route = {
      data: { permission: 'GET /api/tipos-producto' },
    } as unknown as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() => permissionGuard(route, {} as any));

    expect(result).not.toBe(true);
    expect(result.toString()).toContain('/forbidden?permission=GET%20%2Fapi%2Ftipos-producto');
  });
});
