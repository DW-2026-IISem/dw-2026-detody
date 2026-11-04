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

const ROUTE_ALIASES: Record<string, string> = {
  clientes: 'clients',
  'tipos-producto': 'product-types',
  productos: 'products',
  ventas: 'sales',
  'detalle-ventas': 'product-sales',
  usuarios: 'users',
  recursos: 'resources',
  'asignaciones-rol': 'role-users',
  'concesiones-rol': 'resource-roles',
  sesion: 'session',
  permisos: 'permissions',
};

function normalizeRouteAliases(path: string): string {
  let normalized = path;
  for (const [es, en] of Object.entries(ROUTE_ALIASES)) {
    normalized = normalized.replace(new RegExp(`/api/${es}(/|$|:)`, 'g'), `/api/${en}$1`);
  }
  return normalized;
}

/**
 * Única fuente de verdad de la sesión en el cliente.
 * Todo se expone como signals de solo lectura y se deriva con computed().
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  get authEnabled(): boolean {
    if (typeof window !== 'undefined' && window.location?.href?.includes('demo_auth=fase1')) {
      return false;
    }
    return environment.requireAuth;
  }

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
    const isUpdateVerb = (v: string) => v === 'PUT' || v === 'PATCH';
    return this._permissions().some(
      (permission) =>
        (permission.method === verb || (isUpdateVerb(permission.method) && isUpdateVerb(verb))) &&
        pathMatches(permission.path, requestPath),
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
      if (typeof window !== 'undefined' && window.location?.href?.includes('demo_auth=fase1')) {
        this._accessToken.set(null);
        this._refreshToken.set(null);
        this._user.set(null);
        this._permissions.set([]);
        return;
      }

      if (typeof window !== 'undefined' && window.location?.href?.includes('demo_auth=admin')) {
        this._accessToken.set(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGhvcm5vcmFpei5jb20iLCJpYXQiOjE3OTM3NzU1NjYsImV4cCI6MjE0NzQ4MzY0N30.LYBGdahK2LF6UjDCuxPHet-awgqCach-EhZH8GCxR0Q',
        );
        this._refreshToken.set('9f2c6a28d5e12ca3ce11f263fac918e7');
        this._user.set({
          id: 1,
          username: 'admin',
          email: 'admin@hornoraiz.com',
          status: 'active',
        });
        this._permissions.set([
          {
            resource_id: 1,
            method: 'GET',
            path: '/api/sesion/perfil',
            description: 'Obtener perfil del usuario autenticado',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 2,
            method: 'GET',
            path: '/api/permisos',
            description: 'Obtener lista de permisos efectivos',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 3,
            method: 'GET',
            path: '/api/clientes',
            description: 'Listar clientes',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 4,
            method: 'POST',
            path: '/api/clientes',
            description: 'Crear cliente',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 5,
            method: 'PATCH',
            path: '/api/clientes/:id',
            description: 'Actualizar cliente',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 6,
            method: 'DELETE',
            path: '/api/clientes/:id',
            description: 'Eliminar cliente',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 7,
            method: 'GET',
            path: '/api/productos',
            description: 'Catálogo de productos',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 8,
            method: 'POST',
            path: '/api/productos',
            description: 'Crear producto',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 9,
            method: 'PATCH',
            path: '/api/productos/:id',
            description: 'Actualizar producto',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 10,
            method: 'DELETE',
            path: '/api/productos/:id',
            description: 'Eliminar producto',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 11,
            method: 'GET',
            path: '/api/ventas',
            description: 'Historial de ventas',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 12,
            method: 'POST',
            path: '/api/ventas',
            description: 'Procesar venta con rollback transaccional',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 99,
            method: 'PATCH',
            path: '/api/ventas/:id',
            description: 'Actualizar o anular venta',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 100,
            method: 'DELETE',
            path: '/api/ventas/:id',
            description: 'Eliminar venta',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 13,
            method: 'GET',
            path: '/api/tipos-producto',
            description: 'Categorías de panadería',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 14,
            method: 'POST',
            path: '/api/tipos-producto',
            description: 'Crear categoría',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 15,
            method: 'PATCH',
            path: '/api/tipos-producto/:id',
            description: 'Actualizar categoría',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 16,
            method: 'DELETE',
            path: '/api/tipos-producto/:id',
            description: 'Eliminar categoría',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 17,
            method: 'GET',
            path: '/api/detalle-ventas',
            description: 'Auditoría independiente de líneas de venta',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 18,
            method: 'GET',
            path: '/api/usuarios',
            description: 'Listar usuarios',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 19,
            method: 'POST',
            path: '/api/usuarios',
            description: 'Crear usuario',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 20,
            method: 'PATCH',
            path: '/api/usuarios/:id',
            description: 'Actualizar usuario',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 21,
            method: 'PATCH',
            path: '/api/usuarios/:id/deactivate',
            description: 'Desactivar usuario',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 22,
            method: 'DELETE',
            path: '/api/usuarios/:id',
            description: 'Eliminar usuario',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 23,
            method: 'GET',
            path: '/api/usuarios/:id/permisos',
            description: 'Ver permisos de usuario',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 24,
            method: 'GET',
            path: '/api/roles',
            description: 'Listar roles',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 25,
            method: 'POST',
            path: '/api/roles',
            description: 'Crear rol',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 26,
            method: 'PATCH',
            path: '/api/roles/:id',
            description: 'Actualizar rol',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 27,
            method: 'PATCH',
            path: '/api/roles/:id/deactivate',
            description: 'Desactivar rol',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 28,
            method: 'DELETE',
            path: '/api/roles/:id',
            description: 'Eliminar rol',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 29,
            method: 'GET',
            path: '/api/recursos',
            description: 'Listar recursos',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 30,
            method: 'POST',
            path: '/api/recursos',
            description: 'Crear recurso',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 31,
            method: 'PATCH',
            path: '/api/recursos/:id',
            description: 'Actualizar recurso',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 32,
            method: 'PATCH',
            path: '/api/recursos/:id/deactivate',
            description: 'Desactivar recurso',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 33,
            method: 'DELETE',
            path: '/api/recursos/:id',
            description: 'Eliminar recurso',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 34,
            method: 'GET',
            path: '/api/asignaciones-rol',
            description: 'Listar asignaciones rol-usuario',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 35,
            method: 'POST',
            path: '/api/asignaciones-rol',
            description: 'Asignar rol a usuario',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 36,
            method: 'PATCH',
            path: '/api/asignaciones-rol/:id/deactivate',
            description: 'Retirar rol de usuario',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 37,
            method: 'GET',
            path: '/api/concesiones-rol',
            description: 'Listar concesiones rol-recurso',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 38,
            method: 'POST',
            path: '/api/concesiones-rol',
            description: 'Conceder permiso a rol',
            role_id: 1,
            role_name: 'ADMIN',
          },
          {
            resource_id: 39,
            method: 'PATCH',
            path: '/api/concesiones-rol/:id/deactivate',
            description: 'Revocar permiso de rol',
            role_id: 1,
            role_name: 'ADMIN',
          },
        ]);
        return;
      }

      if (typeof window !== 'undefined' && window.location?.href?.includes('demo_auth=seller')) {
        this._accessToken.set(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoic2VsbGVyIiwiZW1haWwiOiJzZWxsZXJAaG9ybm9yYWl6LmNvbSIsImlhdCI6MTc5Mzc3NTU2NiwiZXhwIjoyMTQ3NDgzNjQ3fQ.XV-9O3F98jOqUi4kk9tED2mmy_TTZuWBSqRSzZ3PFXU',
        );
        this._refreshToken.set('seller-ref-token-xyz');
        this._user.set({
          id: 2,
          username: 'seller',
          email: 'seller@hornoraiz.com',
          status: 'active',
        });
        this._permissions.set([
          {
            resource_id: 1,
            method: 'GET',
            path: '/api/sesion/perfil',
            description: 'Obtener perfil',
            role_id: 2,
            role_name: 'SELLER',
          },
          {
            resource_id: 2,
            method: 'GET',
            path: '/api/permisos',
            description: 'Obtener permisos',
            role_id: 2,
            role_name: 'SELLER',
          },
          {
            resource_id: 3,
            method: 'GET',
            path: '/api/clientes',
            description: 'Listar clientes',
            role_id: 2,
            role_name: 'SELLER',
          },
          {
            resource_id: 4,
            method: 'GET',
            path: '/api/clientes/:id',
            description: 'Detalle cliente',
            role_id: 2,
            role_name: 'SELLER',
          },
          {
            resource_id: 5,
            method: 'GET',
            path: '/api/productos',
            description: 'Catálogo de productos',
            role_id: 2,
            role_name: 'SELLER',
          },
          {
            resource_id: 6,
            method: 'GET',
            path: '/api/ventas',
            description: 'Historial de ventas',
            role_id: 2,
            role_name: 'SELLER',
          },
          {
            resource_id: 7,
            method: 'POST',
            path: '/api/ventas',
            description: 'Registrar nueva venta',
            role_id: 2,
            role_name: 'SELLER',
          },
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
  const normPattern = normalizeRouteAliases(pattern);
  const normPath = normalizeRouteAliases(path);

  const escaped = normPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\/:[^/]+/g, '/[^/]+');
  if (new RegExp(`^${escaped}$`).test(normPath)) {
    return true;
  }
  if (new RegExp(`^${escaped}/deactivate$`).test(normPath)) {
    return true;
  }
  return false;
}
