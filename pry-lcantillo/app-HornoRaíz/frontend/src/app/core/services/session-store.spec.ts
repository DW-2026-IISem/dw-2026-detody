import { TestBed } from '@angular/core/testing';
import { SessionStore } from './session-store';
import { EffectivePermission, SessionTokens } from '../models/auth.model';

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(SessionStore);
    store.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crearse e iniciar desautenticado', () => {
    expect(store).toBeTruthy();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.accessToken()).toBeNull();
    expect(store.refreshToken()).toBeNull();
    expect(store.user()).toBeNull();
    expect(store.permissions()).toEqual([]);
  });

  it('debe almacenar tokens y reflejar estado autenticado', () => {
    const tokens: SessionTokens = {
      access_token: 'access-123',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'refresh-abc',
      refresh_expires_in: 604800,
    };
    store.setTokens(tokens);

    expect(store.isAuthenticated()).toBe(true);
    expect(store.accessToken()).toBe('access-123');
    expect(store.refreshToken()).toBe('refresh-abc');
  });

  it('debe actualizar usuario y permisos efectivos con setAccess()', () => {
    const perms: EffectivePermission[] = [
      {
        resource_id: 1,
        method: 'GET',
        path: '/api/clientes',
        description: 'Listar clientes',
        role_id: 1,
        role_name: 'ADMIN',
      },
      {
        resource_id: 2,
        method: 'POST',
        path: '/api/ventas',
        description: 'Crear venta',
        role_id: 1,
        role_name: 'ADMIN',
      },
    ];

    store.setAccess({
      user: { id: 1, username: 'admin', email: 'admin@hornoraiz.com', status: 'active' },
      permissions: perms,
    });

    expect(store.user()?.username).toBe('admin');
    expect(store.permissionCount()).toBe(2);
    expect(store.roleNames()).toEqual(['ADMIN']);
    expect(store.hasRole('ADMIN')).toBe(true);
    expect(store.hasRole('SELLER')).toBe(false);
  });

  it('debe verificar permisos con can() y canPermission()', () => {
    const perms: EffectivePermission[] = [
      {
        resource_id: 1,
        method: 'GET',
        path: '/api/clientes',
        description: null,
        role_id: 1,
        role_name: 'ADMIN',
      },
      {
        resource_id: 2,
        method: 'GET',
        path: '/api/usuarios/:id',
        description: null,
        role_id: 1,
        role_name: 'ADMIN',
      },
    ];
    store.setAccess({
      user: { id: 1, username: 'admin', email: 'admin@hornoraiz.com', status: 'active' },
      permissions: perms,
    });

    expect(store.can('GET', '/api/clientes')).toBe(true);
    expect(store.can('POST', '/api/clientes')).toBe(false);
    expect(store.can('GET', '/api/usuarios/7')).toBe(true);
    expect(store.canPermission('GET /api/clientes')).toBe(true);
    expect(store.canPermission('DELETE /api/clientes')).toBe(false);
  });

  it('debe limpiar todo el estado al llamar clear()', () => {
    store.setTokens({
      access_token: 'acc',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'ref',
      refresh_expires_in: 604800,
    });
    store.clear();

    expect(store.isAuthenticated()).toBe(false);
    expect(store.accessToken()).toBeNull();
    expect(store.refreshToken()).toBeNull();
    expect(store.user()).toBeNull();
  });
});
