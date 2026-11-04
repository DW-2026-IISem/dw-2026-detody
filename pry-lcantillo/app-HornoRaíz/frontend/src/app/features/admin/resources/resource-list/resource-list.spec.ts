import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ResourceList } from './resource-list';
import { environment } from '../../../../../environments/environment';
import { NotificationService } from '../../../../core/services/notification';

describe('ResourceList', () => {
  let component: ResourceList;
  let fixture: ComponentFixture<ResourceList>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
        NotificationService,
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ResourceList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse, cargar recursos y computar contadores por método', () => {
    const req = httpTesting.expectOne(`${environment.apiUrl}/recursos`);
    expect(req.request.method).toBe('GET');
    req.flush({
      resources: [
        { id: 1, method: 'GET', path: '/api/clientes', description: 'Listar' },
        { id: 2, method: 'POST', path: '/api/clientes', description: 'Crear' },
        { id: 3, method: 'GET', path: '/api/productos', description: 'Catálogo' },
      ],
    });

    expect(component).toBeTruthy();
    expect(component.rows().length).toBe(3);
    expect(component.countsByMethod().get('GET')).toBe(2);
    expect(component.countsByMethod().get('POST')).toBe(1);
  });
});
