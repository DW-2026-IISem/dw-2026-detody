import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RoleList } from './role-list';
import { environment } from '../../../../../environments/environment';
import { NotificationService } from '../../../../core/services/notification';

describe('RoleList', () => {
  let component: RoleList;
  let fixture: ComponentFixture<RoleList>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
        NotificationService,
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RoleList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse y cargar lista de roles', () => {
    const req = httpTesting.expectOne(`${environment.apiUrl}/roles`);
    expect(req.request.method).toBe('GET');
    req.flush({
      roles: [
        { id: 1, name: 'ADMIN', description: 'Acceso total', status: 'active' },
        { id: 2, name: 'SELLER', description: 'Vendedor', status: 'active' },
      ],
    });

    expect(component).toBeTruthy();
    expect(component.rows().length).toBe(2);
  });
});
