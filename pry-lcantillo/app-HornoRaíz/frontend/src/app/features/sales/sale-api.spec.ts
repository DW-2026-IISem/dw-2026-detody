import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { SaleCreatePayload } from '../../core/models/sale.model';
import { SaleApi } from './sale-api';

describe('SaleApi', () => {
  let service: SaleApi;
  let http: HttpTestingController;
  const base = `${environment.apiUrl}/ventas`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaleApi, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SaleApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('debe listar ventas extrayendo data.items y normalizando totales e ítems', () => {
    const raw = {
      data: {
        items: [
          {
            id: 1,
            clientId: 1,
            totalAmount: 17000,
            status: 'completed',
            items: [{ id: 1, productId: 1, quantity: 2, unitPrice: 8500, subtotal: 17000 }],
          },
        ],
      },
    };

    service.list().subscribe((sales) => {
      expect(sales.length).toBe(1);
      expect(sales[0].id).toBe(1);
      expect(sales[0].client_id).toBe(1);
      expect(sales[0].total).toBe(17000);
      expect(sales[0].items?.length).toBe(1);
      expect(sales[0].items?.[0].product_id).toBe(1);
    });

    const req = http.expectOne(base);
    expect(req.request.method).toBe('GET');
    req.flush(raw);
  });

  it('debe obtener una venta por ID', () => {
    service.get(1).subscribe((s) => {
      expect(s.id).toBe(1);
      expect(s.total).toBe(17000);
    });

    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: { id: 1, clientId: 1, totalAmount: 17000, status: 'completed' } });
  });

  it('debe registrar una venta transaccional vía POST', () => {
    const payload: SaleCreatePayload = {
      client_id: 1,
      items: [{ product_id: 1, quantity: 2 }],
    };

    service.create(payload).subscribe((sale) => {
      expect(sale.id).toBe(2);
      expect(sale.total).toBe(17000);
    });

    const req = http.expectOne(base);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.clientId).toBe(1);
    req.flush({ data: { id: 2, clientId: 1, totalAmount: 17000, status: 'completed' } });
  });

  it('debe actualizar una venta vía PATCH', () => {
    service.update(1, { status: 'cancelled' }).subscribe((sale) => {
      expect(sale.status).toBe('cancelled');
    });

    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ data: { id: 1, status: 'cancelled' } });
  });

  it('debe cancelar venta vía PATCH /deactivate', () => {
    service.deactivate(1).subscribe();

    const req = http.expectOne(`${base}/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('debe eliminar venta físicamente vía DELETE', () => {
    service.remove(1).subscribe();

    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
