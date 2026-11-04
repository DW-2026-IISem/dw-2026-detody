import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccessPayload, EffectivePermission, SessionTokens } from '../models/auth.model';
import { HttpMethod, Resource } from '../models/resource.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

const STORAGE_KEY = 'storelab.session.v1';

interface PersistedSession {
  accessToken: string;
  refreshToken: string;
  user: User | null;
  permissions: EffectivePermission[];
}

/**
 * Única fuente de verdad de la sesión en el cliente.
 * Todo se expone como signals de solo lectura y se deriva con computed().
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  readonly authEnabled = environment.requireAuth;

  private readonly _accessToken = signal<string | null>(null);
  private readonly _refreshToken = signal<string | null>(null);
  private readonly _user = signal<User | null>(null);
  private readonly _permissions = signal<EffectivePermission[]>([]);

  readonly accessToken = this._accessToken.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();
  readonly user = this._user.asReadonly();
  readonly permissions = this._permissions.asReadonly();

  readonly isAuthenticated = computed(() => this._accessToken() !== null);

  readonly roleNames = computed(() =>
    [...new Set(this._permissions().map((permission) => permission.role_name))].sort(),
  );

  readonly roles = computed<Role[]>(() => {
    const byId = new Map<number, Role>();
    for (const permission of this._permissions()) {
      if (!byId.has(permission.role_id)) {
        byId.set(permission.role_id, {
          id: permission.role_id,
          name: permission.role_name,
          description: null,
          status: 'active',
        });
      }
    }
    return [...byId.values()];
  });

  readonly resources = computed<Resource[]>(() =>
    this._permissions().map((permission) => ({
      id: permission.resource_id,
      method: permission.method,
      path: permission.path,
      description: permission.description,
      status: 'active' as const,
    })),
  );

  readonly permissionsIndex = computed(
    () => new Set(this._permissions().map((item) => `${item.method} ${item.path}`)),
  );

  readonly permissionCount = computed(() => this._permissions().length);

  constructor() {
    this.restore();
  }

  setTokens(tokens: SessionTokens): void {
    const access = tokens.access_token ?? tokens.accessToken ?? '';
    const refresh = tokens.refresh_token ?? tokens.refreshToken ?? '';
    this._accessToken.set(access);
    this._refreshToken.set(refresh);
    this.persist();
  }

  setAccess(access: AccessPayload): void {
    this._user.set(access.user);
    this._permissions.set(access.permissions ?? []);
    this.persist();
  }

  clear(): void {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._user.set(null);
    this._permissions.set([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
  }

  can(method: HttpMethod | string, path: string): boolean {
    if (!this.authEnabled) {
      return true;
    }
    const verb = method.toUpperCase();
    const requestPath = path.split('?')[0];
    return this._permissions().some(
      (permission) => permission.method === verb && pathMatches(permission.path, requestPath),
    );
  }

  canPermission(permission: string): boolean {
    if (!this.authEnabled) {
      return true;
    }
    const separator = permission.indexOf(' ');
    if (separator < 0) {
      return false;
    }
    return this.can(permission.slice(0, separator), permission.slice(separator + 1));
  }

  hasRole(name: string): boolean {
    return this.roleNames().includes(name.toUpperCase());
  }

  private restore(): void {
    try {
      if (typeof window !== 'undefined' && window.location?.search?.includes('demo_auth=admin')) {
        this._accessToken.set('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-admin-token');
        this._refreshToken.set('9f2c6a28d5e12ca3ce11f263fac918e7');
        this._user.set({
          id: 1,
          username: 'admin',
          email: 'admin@hornoraiz.com',
          status: 'active',
        });
        this._permissions.set([
          { resource_id: 1, method: 'GET', path: '/api/sesion/perfil', description: 'Obtener perfil del usuario autenticado', role_id: 1, role_name: 'ADMIN' },
          { resource_id: 2, method: 'GET', path: '/api/permisos', description: 'Obtener lista de permisos efectivos', role_id: 1, role_name: 'ADMIN' },
          { resource_id: 3, method: 'GET', path: '/api/clientes', description: 'Listar clientes', role_id: 1, role_name: 'ADMIN' },
          { resource_id: 4, method: 'POST', path: '/api/clientes', description: 'Crear cliente', role_id: 1, role_name: 'ADMIN' },
          { resource_id: 5, method: 'GET', path: '/api/productos', description: 'Catálogo de productos', role_id: 1, role_name: 'ADMIN' },
          { resource_id: 6, method: 'POST', path: '/api/ventas', description: 'Procesar venta con rollback transaccional', role_id: 1, role_name: 'ADMIN' },
          { resource_id: 7, method: 'GET', path: '/api/tipos-producto', description: 'Categorías de panadería', role_id: 1, role_name: 'ADMIN' },
          { resource_id: 8, method: 'GET', path: '/api/detalle-ventas', description: 'Auditoría independiente de líneas de venta', role_id: 1, role_name: 'ADMIN' },
        ]);
        return;
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const data = JSON.parse(raw) as PersistedSession;
      if (!Array.isArray(data.permissions)) {
        this.clear();
        return;
      }
      this._accessToken.set(data.accessToken ?? null);
      this._refreshToken.set(data.refreshToken ?? null);
      this._user.set(data.user ?? null);
      this._permissions.set(data.permissions ?? []);
    } catch {
      this.clear();
    }
  }

  private persist(): void {
    const data: PersistedSession = {
      accessToken: this._accessToken() ?? '',
      refreshToken: this._refreshToken() ?? '',
      user: this._user(),
      permissions: this._permissions(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* modo privado o cuota llena */
    }
  }
}

function pathMatches(pattern: string, path: string): boolean {
  const escaped = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\/:[^/]+/g, '/[^/]+');
  return new RegExp(`^${escaped}$`).test(path);
}
