import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductTypeApi } from './product-type-api';
import { environment } from '../../../environments/environment';
import { ProductType, ProductTypePayload } from '../../core/models/product-type.model';

describe('ProductTypeApi', () => {
  let service: ProductTypeApi;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/tipos-producto`;

  const MOCK_TYPES: ProductType[] = [
    { id: 1, name: 'Panadería Tradicional', description: 'Panes de uso diario', status: 'active' },
    { id: 2, name: 'Pastelería y Repostería', description: 'Tortas y postres', status: 'active' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductTypeApi,
      ],
    });
    service = TestBed.inject(ProductTypeApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe listar tipos de producto usando GET /api/tipos-producto', () => {
    service.list().subscribe((types) => {
      expect(types.length).toBe(2);
      expect(types[0].name).toBe('Panadería Tradicional');
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ product_types: MOCK_TYPES });
  });

  it('debe obtener un tipo de producto por su id', () => {
    service.get(1).subscribe((item) => {
      expect(item.id).toBe(1);
      expect(item.name).toBe('Panadería Tradicional');
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ product_type: MOCK_TYPES[0] });
  });

  it('debe crear un nuevo tipo de producto mediante POST', () => {
    const payload: ProductTypePayload = { name: 'Gourmet', description: 'Panes especiales', status: 'active' };
    const created: ProductType = { id: 3, ...payload, status: 'active' };

    service.create(payload).subscribe((item) => {
      expect(item.id).toBe(3);
      expect(item.name).toBe('Gourmet');
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ product_type: created });
  });

  it('debe actualizar un tipo mediante PATCH', () => {
    const patchPayload: Partial<ProductTypePayload> = { name: 'Panes Rústicos' };
    const updated: ProductType = { id: 1, name: 'Panes Rústicos', description: 'Panes de uso diario', status: 'active' };

    service.update(1, patchPayload).subscribe((item) => {
      expect(item.name).toBe('Panes Rústicos');
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(patchPayload);
    req.flush({ product_type: updated });
  });

  it('debe ejecutar la baja lógica mediante PATCH /:id/deactivate y física mediante DELETE', () => {
    service.deactivate(1).subscribe();
    const deactReq = httpTesting.expectOne(`${baseUrl}/1/deactivate`);
    expect(deactReq.request.method).toBe('PATCH');
    deactReq.flush({ product_type: { ...MOCK_TYPES[0], status: 'inactive' } });

    service.remove(1).subscribe();
    const delReq = httpTesting.expectOne(`${baseUrl}/1`);
    expect(delReq.request.method).toBe('DELETE');
    delReq.flush(null);
  });
});
