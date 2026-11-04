import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AccessPayload,
  LoginRequest,
  PermissionsPayload,
  ProfilePayload,
  SessionTokens,
} from '../models/auth.model';
import { SessionStore } from './session-store';

/**
 * Cliente del feature Session del backend HornoRaíz.
 *
 * | Endpoint | Modalidad | Devuelve |
 * |---|---|---|
 * | `POST /api/sesion/login` | OPEN | `SessionTokens` (solo tokens) |
 * | `GET /api/sesion/perfil` | JWT | `{ user }` |
 * | `GET /api/permisos` | JWT | `{ permissions }` (permisos efectivos) |
 * | `POST /api/sesion/refresh` | OPEN (refresh token) | `SessionTokens` |
 * | `POST /api/sesion/logout` | OPEN (refresh token) | `{ message }` |
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionStore);
  private readonly base = `${environment.apiUrl}/sesion`;
  private readonly permissionsUrl = `${environment.apiUrl}/permisos`;

  /** Login + carga de identidad/permisos encadenada con switchMap. */
  login(credentials: LoginRequest): Observable<AccessPayload> {
    return this.http.post<any>(`${this.base}/login`, credentials).pipe(
      map((res: any) => (res?.data ?? res) as SessionTokens),
      tap((tokens) => this.session.setTokens(tokens)),
      switchMap(() =>
        this.me().pipe(
          catchError((error: unknown) => {
            this.session.clear();
            return throwError(() => error);
          }),
        ),
      ),
    );
  }

  /**
   * `GET /api/sesion/perfil` + `GET /api/permisos`.
   * Se usa tras el login y en "Actualizar permisos" del menú.
   */
  me(): Observable<AccessPayload> {
    return forkJoin({
      profile: this.http.get<any>(`${this.base}/perfil`).pipe(
        map((res: any) => {
          const raw = res?.data ?? res;
          return { user: raw?.user ?? raw } as ProfilePayload;
        }),
      ),
      permissions: this.http.get<any>(this.permissionsUrl).pipe(
        map((res: any) => {
          const raw = res?.data ?? res;
          const list = raw?.permissions ?? (Array.isArray(raw) ? raw : []);
          return { permissions: list } as PermissionsPayload;
        }),
      ),
    }).pipe(
      map(({ profile, permissions }) => ({
        user: profile.user,
        permissions: permissions.permissions,
      })),
      tap((access) => this.session.setAccess(access)),
    );
  }

  /** Renueva el par de tokens; el refresh token anterior queda rotado. */
  refresh(): Observable<SessionTokens> {
    const refresh_token = this.session.refreshToken();
    if (!refresh_token) {
      return throwError(() => new Error('No hay refresh token en la sesión'));
    }
    return this.http.post<any>(`${this.base}/refresh`, { refresh_token }).pipe(
      map((res: any) => (res?.data ?? res) as SessionTokens),
      tap((tokens) => this.session.setTokens(tokens)),
    );
  }

  /**
   * Cierra la sesión del refresh token presentado.
   * Siempre limpia el estado local (finalize), incluso si el backend no responde.
   */
  logout(): Observable<unknown> {
    const refresh_token = this.session.refreshToken();
    return this.http.post(`${this.base}/logout`, { refresh_token }).pipe(
      catchError(() => of(null)),
      finalize(() => this.session.clear()),
    );
  }
}
