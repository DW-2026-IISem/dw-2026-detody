import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ProductSalePayload } from '../../core/models/product-sale.model';
import { ProductSaleApi } from './product-sale-api';

describe('ProductSaleApi', () => {
  let service: ProductSaleApi;
  let http: HttpTestingController;
  const base = `${environment.apiUrl}/detalle-ventas`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductSaleApi, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductSaleApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('debe listar líneas de detalle normalizando datos', () => {
    const raw = {
      data: {
        items: [{ id: 1, saleId: 1, productId: 1, quantity: 2, unitPrice: 8500, subtotal: 17000 }],
      },
    };

    service.list().subscribe((lines) => {
      expect(lines.length).toBe(1);
      expect(lines[0].sale_id).toBe(1);
      expect(lines[0].product_id).toBe(1);
      expect(lines[0].unit_price).toBe(8500);
      expect(lines[0].subtotal).toBe(17000);
    });

    const req = http.expectOne(base);
    expect(req.request.method).toBe('GET');
    req.flush(raw);
  });

  it('debe obtener una línea por ID', () => {
    service.get(1).subscribe((line) => {
      expect(line.id).toBe(1);
      expect(line.quantity).toBe(2);
    });

    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: { id: 1, saleId: 1, productId: 1, quantity: 2, unitPrice: 8500 } });
  });

  it('debe crear una línea vía POST', () => {
    const payload: ProductSalePayload = {
      sale_id: 1,
      product_id: 2,
      quantity: 1,
    };

    service.create(payload).subscribe((line) => {
      expect(line.id).toBe(3);
    });

    const req = http.expectOne(base);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.productId).toBe(2);
    req.flush({
      data: { id: 3, saleId: 1, productId: 2, quantity: 1, unitPrice: 45000, subtotal: 45000 },
    });
  });

  it('debe actualizar cantidad vía PATCH', () => {
    service.update(1, { quantity: 4 }).subscribe((line) => {
      expect(line.quantity).toBe(4);
    });

    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.quantity).toBe(4);
    req.flush({ data: { id: 1, quantity: 4 } });
  });

  it('debe anular línea vía PATCH /deactivate', () => {
    service.deactivate(1).subscribe();

    const req = http.expectOne(`${base}/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('debe eliminar línea vía DELETE', () => {
    service.remove(1).subscribe();

    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
