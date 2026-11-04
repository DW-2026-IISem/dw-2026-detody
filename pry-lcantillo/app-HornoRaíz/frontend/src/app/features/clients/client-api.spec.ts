import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClientApi } from './client-api';
import { environment } from '../../../environments/environment';
import { Client, ClientPayload } from '../../core/models';

describe('ClientApi', () => {
  let service: ClientApi;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/clients`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ClientApi,
      ],
    });
    service = TestBed.inject(ClientApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe listar clientes cuando la respuesta viene con wrapper items', () => {
    const mockClients: Client[] = [
      { id: 1, name: 'Panadería Central', status: 'active' },
      { id: 2, name: 'Pastelería Dulce', status: 'active' },
    ];

    service.list().subscribe((clients) => {
      expect(clients.length).toBe(2);
      expect(clients[0].name).toBe('Panadería Central');
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ items: mockClients, meta: { total: 2, page: 1, limit: 10 } });
  });

  it('debe listar clientes cuando la respuesta es un arreglo directo', () => {
    const mockClients: Client[] = [
      { id: 1, name: 'Panadería Central', status: 'active' },
    ];

    service.findAll().subscribe((clients) => {
      expect(clients.length).toBe(1);
      expect(clients[0].id).toBe(1);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockClients);
  });

  it('debe obtener un cliente por id', () => {
    const mockClient: Client = { id: 5, name: 'Café del Parque', status: 'active' };

    service.findById(5).subscribe((client) => {
      expect(client.id).toBe(5);
      expect(client.name).toBe('Café del Parque');
    });

    const req = httpTesting.expectOne(`${baseUrl}/5`);
    expect(req.request.method).toBe('GET');
    req.flush({ client: mockClient });
  });

  it('debe crear un nuevo cliente', () => {
    const payload: ClientPayload = { name: 'Horno La Unión', email: 'union@horno.com', status: 'active' };
    const createdClient: Client = { id: 10, ...payload, status: 'active' };

    service.create(payload).subscribe((client) => {
      expect(client.id).toBe(10);
      expect(client.name).toBe('Horno La Unión');
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ client: createdClient });
  });

  it('debe actualizar un cliente existente mediante PATCH', () => {
    const updatePayload: Partial<ClientPayload> = { phone: '3001234567' };
    const updatedClient: Client = { id: 10, name: 'Horno La Unión', phone: '3001234567', status: 'active' };

    service.update(10, updatePayload).subscribe((client) => {
      expect(client.phone).toBe('3001234567');
    });

    const req = httpTesting.expectOne(`${baseUrl}/10`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ client: updatedClient });
  });

  it('debe realizar la baja lógica mediante PATCH /:id/deactivate', () => {
    service.deactivate(10).subscribe((res) => {
      expect(res.message).toBe('Client deactivated');
    });

    const req = httpTesting.expectOne(`${baseUrl}/10/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ message: 'Client deactivated' });
  });

  it('debe eliminar un cliente definitivamente por id', () => {
    service.remove(10).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/10`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
