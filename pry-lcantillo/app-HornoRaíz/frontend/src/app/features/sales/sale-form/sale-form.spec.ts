import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Client } from '../../../core/models/client.model';
import { Product } from '../../../core/models/product.model';
import { NotificationService } from '../../../core/services/notification';
import { SaleForm } from './sale-form';

describe('SaleForm', () => {
  let component: SaleForm;
  let fixture: ComponentFixture<SaleForm>;
  let httpTesting: HttpTestingController;
  let router: Router;
  let notifyService: NotificationService;

  const clientsUrl = `${environment.apiUrl}/clients`;
  const productsUrl = `${environment.apiUrl}/productos`;
  const salesUrl = `${environment.apiUrl}/ventas`;

  const mockClients: Client[] = [
    { id: 1, name: 'Cliente HornoRaíz', email: 'demo@hornoraiz.com', status: 'active' },
  ];

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Pan Baguette Masa Madre',
      price: 8500,
      stock: 10,
      quantity: 10,
      status: 'active',
    },
    {
      id: 2,
      name: 'Torta de Chocolate',
      price: 45000,
      stock: 2,
      quantity: 2,
      status: 'active',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        NotificationService,
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    notifyService = TestBed.inject(NotificationService);

    fixture = TestBed.createComponent(SaleForm);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse y cargar clientes y productos activos con forkJoin', () => {
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    expect(component).toBeTruthy();
    expect(component.clients().length).toBe(1);
    expect(component.products().length).toBe(2);
    expect(component.loading()).toBe(false);
  });

  it('debe validar selección de producto y cantidad al agregar línea', () => {
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    component.selectedProductId.set(null);
    component.addLine();
    expect(component.error()).toContain('Selecciona un producto');

    component.selectedProductId.set(1);
    component.quantity.set(0);
    component.addLine();
    expect(component.error()).toContain('La cantidad debe ser al menos 1');
  });

  it('debe validar stock disponible antes de agregar al borrador', () => {
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    component.selectedProductId.set(2); // Torta stock: 2
    component.quantity.set(5); // Pide 5
    component.addLine();

    expect(component.error()).toContain('Stock insuficiente');
    expect(component.lines().length).toBe(0);
  });

  it('debe agregar línea válida al borrador y agrupar si el producto se repite', () => {
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    component.selectedProductId.set(1);
    component.quantity.set(2);
    component.addLine();

    expect(component.lines().length).toBe(1);
    expect(component.lines()[0].quantity).toBe(2);
    expect(component.subtotal()).toBe(17000);

    // Agrega 3 más del mismo producto
    component.selectedProductId.set(1);
    component.quantity.set(3);
    component.addLine();

    expect(component.lines().length).toBe(1);
    expect(component.lines()[0].quantity).toBe(5);
    expect(component.subtotal()).toBe(42500);
  });

  it('debe calcular subtotal y total derivado con impuestos y descuentos', () => {
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    component.selectedProductId.set(1);
    component.quantity.set(2); // 2 * 8500 = 17000
    component.addLine();

    component.tax.set(3230); // 19% IVA
    component.discounts.set(2000); // Descuento

    expect(component.subtotal()).toBe(17000);
    expect(component.total()).toBe(17000 + 3230 - 2000);
  });

  it('debe eliminar líneas del borrador', () => {
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    component.selectedProductId.set(1);
    component.quantity.set(1);
    component.addLine();

    expect(component.lines().length).toBe(1);
    component.removeLine(0);
    expect(component.lines().length).toBe(0);
    expect(component.subtotal()).toBe(0);
  });

  it('debe enviar POST transaccional al guardar y navegar a /ventas', () => {
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });

    const navSpy = vi.spyOn(router, 'navigate');

    component.clientId.set(1);
    component.selectedProductId.set(1);
    component.quantity.set(2);
    component.addLine();

    component.save();

    const postReq = httpTesting.expectOne(salesUrl);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body.clientId).toBe(1);
    expect(postReq.request.body.items.length).toBe(1);

    postReq.flush({ data: { id: 10, totalAmount: 17000 } });

    expect(component.saving()).toBe(false);
    expect(navSpy).toHaveBeenCalledWith(['/ventas']);
  });
});
