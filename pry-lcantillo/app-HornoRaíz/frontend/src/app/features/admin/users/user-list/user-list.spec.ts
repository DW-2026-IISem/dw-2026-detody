import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserList } from './user-list';
import { environment } from '../../../../../environments/environment';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';

describe('UserList', () => {
  let component: UserList;
  let fixture: ComponentFixture<UserList>;
  let httpTesting: HttpTestingController;
  let sessionStore: SessionStore;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [UserList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
        NotificationService,
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    sessionStore = TestBed.inject(SessionStore);
    sessionStore.setAccess({
      user: { id: 1, username: 'admin', email: 'admin@hornoraiz.com', status: 'active' },
      permissions: [
        { resource_id: 1, method: 'GET', path: '/api/usuarios', description: null, role_id: 1, role_name: 'ADMIN' },
        { resource_id: 2, method: 'POST', path: '/api/usuarios', description: null, role_id: 1, role_name: 'ADMIN' },
      ],
    });

    fixture = TestBed.createComponent(UserList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('debe crearse y cargar lista de usuarios', () => {
    const req = httpTesting.expectOne(`${environment.apiUrl}/usuarios`);
    expect(req.request.method).toBe('GET');
    req.flush({
      users: [
        { id: 1, username: 'admin', email: 'admin@hornoraiz.com', status: 'active' },
        { id: 2, username: 'seller', email: 'seller@hornoraiz.com', status: 'active' },
      ],
    });

    expect(component).toBeTruthy();
    expect(component.rows().length).toBe(2);
    expect(component.isSelf(component.rows()[0])).toBe(true);
    expect(component.isSelf(component.rows()[1])).toBe(false);
  });

  it('debe abrir y cerrar formulario modal', () => {
    const req = httpTesting.expectOne(`${environment.apiUrl}/usuarios`);
    req.flush({ users: [] });

    expect(component.formOpen()).toBe(false);
    component.openCreate();
    expect(component.formOpen()).toBe(true);
    expect(component.selectedUser()).toBeNull();
  });

  it('debe consultar permisos del usuario al invocar viewPermissions', () => {
    const req = httpTesting.expectOne(`${environment.apiUrl}/usuarios`);
    req.flush({ users: [{ id: 2, username: 'seller', email: 'seller@hornoraiz.com', status: 'active' }] });

    component.viewPermissions(component.rows()[0]);
    expect(component.accessOpen()).toBe(true);

    const permReq = httpTesting.expectOne(`${environment.apiUrl}/usuarios/2/permisos`);
    expect(permReq.request.method).toBe('GET');
    permReq.flush({
      permissions: [
        { resource_id: 10, method: 'GET', path: '/api/clientes', description: 'Listar clientes', role_id: 2, role_name: 'SELLER' },
      ],
    });

    expect(component.access().length).toBe(1);
    expect(component.accessRoles().length).toBe(1);
    expect(component.accessRoles()[0].name).toBe('SELLER');
  });
});
