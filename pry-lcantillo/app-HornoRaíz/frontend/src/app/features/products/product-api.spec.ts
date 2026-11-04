import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Product, ProductPayload } from '../../core/models/product.model';
import { ProductApi } from './product-api';

describe('ProductApi', () => {
  let service: ProductApi;
  let http: HttpTestingController;
  const base = `${environment.apiUrl}/productos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductApi, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('debe listar productos extrayendo data.items y normalizando stock', () => {
    const raw = {
      data: {
        items: [
          {
            id: 1,
            name: 'Pan Baguette',
            price: 8500,
            stock: 28,
            productTypeId: 1,
            status: 'active',
          },
        ],
      },
    };

    service.list().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Pan Baguette');
      expect(products[0].quantity).toBe(28);
      expect(products[0].product_type_id).toBe(1);
    });

    const req = http.expectOne(base);
    expect(req.request.method).toBe('GET');
    req.flush(raw);
  });

  it('debe listar productos extrayendo response.products', () => {
    const raw = {
      products: [
        {
          id: 2,
          name: 'Croissant',
          price: 7000,
          quantity: 15,
          product_type_id: 1,
          status: 'active',
        },
      ],
    };

    service.list().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].stock).toBe(15);
      expect(products[0].productTypeId).toBe(1);
    });

    const req = http.expectOne(base);
    expect(req.request.method).toBe('GET');
    req.flush(raw);
  });

  it('debe obtener un producto por ID', () => {
    service.get(1).subscribe((p) => {
      expect(p.id).toBe(1);
      expect(p.name).toBe('Pan Baguette');
    });

    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: { id: 1, name: 'Pan Baguette', price: 8500, stock: 28 } });
  });

  it('debe crear un producto vía POST', () => {
    const payload: ProductPayload = {
      name: 'Torta de Café',
      price: 32000,
      stock: 10,
      product_type_id: 2,
    };

    service.create(payload).subscribe((p) => {
      expect(p.name).toBe('Torta de Café');
    });

    const req = http.expectOne(base);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.productTypeId).toBe(2);
    req.flush({ data: { id: 5, ...payload } });
  });

  it('debe actualizar un producto vía PATCH', () => {
    service.update(1, { price: 9000 }).subscribe((p) => {
      expect(p.price).toBe(9000);
    });

    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ data: { id: 1, name: 'Pan Baguette', price: 9000 } });
  });

  it('debe dar de baja lógica vía PATCH /deactivate', () => {
    service.deactivate(1).subscribe();

    const req = http.expectOne(`${base}/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('debe eliminar físicamente vía DELETE', () => {
    service.remove(1).subscribe();

    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
