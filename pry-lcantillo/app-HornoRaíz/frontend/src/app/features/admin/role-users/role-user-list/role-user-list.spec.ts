import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RoleUserList } from './role-user-list';
import { environment } from '../../../../../environments/environment';
import { NotificationService } from '../../../../core/services/notification';

describe('RoleUserList', () => {
  let component: RoleUserList;
  let fixture: ComponentFixture<RoleUserList>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleUserList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
        NotificationService,
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RoleUserList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse y cargar asignaciones, usuarios y roles en paralelo', () => {
    const reqAssignments = httpTesting.expectOne(`${environment.apiUrl}/asignaciones-rol`);
    const reqUsers = httpTesting.expectOne(`${environment.apiUrl}/usuarios`);
    const reqRoles = httpTesting.expectOne(`${environment.apiUrl}/roles`);

    reqAssignments.flush({
      assignments: [
        { id: 1, user_id: 1, role_id: 1, user: { id: 1, username: 'admin' }, role: { id: 1, name: 'ADMIN' } },
      ],
    });
    reqUsers.flush({ users: [{ id: 1, username: 'admin' }] });
    reqRoles.flush({ roles: [{ id: 1, name: 'ADMIN' }] });

    expect(component).toBeTruthy();
    expect(component.rows().length).toBe(1);
    expect(component.users().length).toBe(1);
    expect(component.roles().length).toBe(1);
  });
});
