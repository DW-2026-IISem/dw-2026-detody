import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth';
import { SessionStore } from './session-store';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let sessionStore: SessionStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService, SessionStore],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStore = TestBed.inject(SessionStore);
    sessionStore.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe ejecutar login() encadenando me() para cargar tokens, perfil y permisos', () => {
    service.login({ identifier: 'admin', password: 'password' }).subscribe((access) => {
      expect(access.user.username).toBe('admin');
      expect(access.permissions.length).toBe(1);
    });

    // 1. Petición de login
    const loginReq = httpMock.expectOne(`${environment.apiUrl}/sesion/login`);
    expect(loginReq.request.method).toBe('POST');
    loginReq.flush({
      access_token: 'jwt-token-1',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'refresh-token-1',
      refresh_expires_in: 604800,
    });

    // 2. me() encadenado consulta /perfil y /permisos con forkJoin
    const perfilReq = httpMock.expectOne(`${environment.apiUrl}/sesion/perfil`);
    expect(perfilReq.request.method).toBe('GET');
    perfilReq.flush({
      user: { id: 1, username: 'admin', email: 'admin@hornoraiz.com', status: 'active' },
    });

    const permisosReq = httpMock.expectOne(`${environment.apiUrl}/permisos`);
    expect(permisosReq.request.method).toBe('GET');
    permisosReq.flush({
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

    expect(sessionStore.isAuthenticated()).toBe(true);
    expect(sessionStore.accessToken()).toBe('jwt-token-1');
    expect(sessionStore.user()?.username).toBe('admin');
  });

  it('debe renovar tokens con refresh()', () => {
    sessionStore.setTokens({
      access_token: 'old-acc',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'old-ref',
      refresh_expires_in: 604800,
    });

    service.refresh().subscribe((tokens) => {
      expect(tokens.access_token).toBe('new-acc');
      expect(tokens.refresh_token).toBe('new-ref');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/sesion/refresh`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refresh_token: 'old-ref' });
    req.flush({
      access_token: 'new-acc',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'new-ref',
      refresh_expires_in: 604800,
    });

    expect(sessionStore.accessToken()).toBe('new-acc');
  });

  it('debe ejecutar logout() y limpiar la sesión', () => {
    sessionStore.setTokens({
      access_token: 'acc',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'ref',
      refresh_expires_in: 604800,
    });

    service.logout().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/sesion/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Sesión cerrada exitosamente' });

    expect(sessionStore.isAuthenticated()).toBe(false);
    expect(sessionStore.accessToken()).toBeNull();
  });
});
