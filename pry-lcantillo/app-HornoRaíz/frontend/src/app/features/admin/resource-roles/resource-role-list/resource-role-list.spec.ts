import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ResourceRoleList } from './resource-role-list';
import { environment } from '../../../../../environments/environment';
import { NotificationService } from '../../../../core/services/notification';

describe('ResourceRoleList', () => {
  let component: ResourceRoleList;
  let fixture: ComponentFixture<ResourceRoleList>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceRoleList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
        NotificationService,
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ResourceRoleList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse y cargar concesiones, roles y recursos', () => {
    const reqGrants = httpTesting.expectOne(`${environment.apiUrl}/concesiones-rol`);
    const reqRoles = httpTesting.expectOne(`${environment.apiUrl}/roles`);
    const reqResources = httpTesting.expectOne(`${environment.apiUrl}/recursos`);

    reqGrants.flush({
      grants: [
        { id: 1, role_id: 1, resource_id: 5, role: { id: 1, name: 'ADMIN' }, resource: { id: 5, method: 'GET', path: '/api/clientes' } },
      ],
    });
    reqRoles.flush({ roles: [{ id: 1, name: 'ADMIN' }] });
    reqResources.flush({ resources: [{ id: 5, method: 'GET', path: '/api/clientes' }] });

    expect(component).toBeTruthy();
    expect(component.rows().length).toBe(1);
    expect(component.roles().length).toBe(1);
    expect(component.resources().length).toBe(1);
  });
});
