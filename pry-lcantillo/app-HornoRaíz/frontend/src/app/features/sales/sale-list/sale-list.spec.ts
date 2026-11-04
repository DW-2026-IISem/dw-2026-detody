import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Client } from '../../../core/models/client.model';
import { Product } from '../../../core/models/product.model';
import { Sale } from '../../../core/models/sale.model';
import { NotificationService } from '../../../core/services/notification';
import { SaleList } from './sale-list';

describe('SaleList', () => {
  let component: SaleList;
  let fixture: ComponentFixture<SaleList>;
  let httpTesting: HttpTestingController;
  let confirmationService: ConfirmationService;
  let notifyService: NotificationService;

  const salesUrl = `${environment.apiUrl}/ventas`;
  const clientsUrl = `${environment.apiUrl}/clients`;
  const productsUrl = `${environment.apiUrl}/productos`;

  const mockClients: Client[] = [{ id: 1, name: 'Cliente HornoRaíz Demo', status: 'active' }];

  const mockProducts: Product[] = [
    { id: 1, name: 'Pan Baguette', price: 8500, stock: 20, status: 'active' },
  ];

  const mockSales: Sale[] = [
    {
      id: 1,
      client_id: 1,
      total: 17000,
      totalAmount: 17000,
      status: 'completed',
      items: [{ id: 1, product_id: 1, quantity: 2, unitPrice: 8500, subtotal: 17000 }],
    },
    {
      id: 2,
      client_id: 1,
      total: 8500,
      totalAmount: 8500,
      status: 'cancelled',
      items: [{ id: 2, product_id: 1, quantity: 1, unitPrice: 8500, subtotal: 8500 }],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        ConfirmationService,
        MessageService,
        NotificationService,
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    confirmationService = TestBed.inject(ConfirmationService);
    notifyService = TestBed.inject(NotificationService);

    fixture = TestBed.createComponent(SaleList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe inicializarse y cargar ventas, clientes y productos en paralelo con forkJoin', () => {
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    expect(component).toBeTruthy();
    expect(component.rows().length).toBe(2);
    expect(component.clients().length).toBe(1);
    expect(component.products().length).toBe(1);
    expect(component.loading()).toBe(false);
  });

  it('debe resolver el nombre del cliente con Map memorizado', () => {
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    expect(component.clientName()(1)).toBe('Cliente HornoRaíz Demo');
    expect(component.clientName()(99)).toBe('Cliente #99');
  });

  it('debe calcular totalRevenue sumando solo ventas no canceladas', () => {
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    // mockSales[0] = 17000 (completed), mockSales[1] = 8500 (cancelled) => totalRevenue = 17000
    expect(component.totalRevenue()).toBe(17000);
  });

  it('debe calcular el total de unidades de una venta con itemsCount', () => {
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    expect(component.itemsCount(mockSales[0])).toBe(2);
    expect(component.itemsCount(mockSales[1])).toBe(1);
  });

  it('debe filtrar ventas por buscador local', () => {
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    component.filter.set('cancelled');
    expect(component.visibleRows().length).toBe(1);
    expect(component.visibleRows()[0].id).toBe(2);
  });

  it('debe cancelar venta vía PATCH /:id/deactivate tras confirmación', () => {
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    vi.spyOn(confirmationService, 'confirm').mockImplementation((conf: any) => {
      if (conf.accept) conf.accept();
      return confirmationService;
    });

    component.deactivate(mockSales[0]);

    const deactReq = httpTesting.expectOne(`${salesUrl}/1/deactivate`);
    expect(deactReq.request.method).toBe('PATCH');
    deactReq.flush({});

    // Recarga posterior
    httpTesting.expectOne(salesUrl).flush({ data: { items: [mockSales[1]] } });
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    expect(component.rows().length).toBe(1);
  });

  it('debe eliminar venta vía DELETE /:id tras confirmación', () => {
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    vi.spyOn(confirmationService, 'confirm').mockImplementation((conf: any) => {
      if (conf.accept) conf.accept();
      return confirmationService;
    });

    component.remove(mockSales[0]);

    const delReq = httpTesting.expectOne(`${salesUrl}/1`);
    expect(delReq.request.method).toBe('DELETE');
    delReq.flush({});

    // Recarga posterior
    httpTesting.expectOne(salesUrl).flush({ data: { items: [mockSales[1]] } });
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    expect(component.rows().length).toBe(1);
  });
});
