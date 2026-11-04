import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Client } from '../../core/models/client.model';
import { ProductType } from '../../core/models/product-type.model';
import { Product } from '../../core/models/product.model';
import { Sale } from '../../core/models/sale.model';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpTesting: HttpTestingController;

  const clientsUrl = `${environment.apiUrl}/clients`;
  const typesUrl = `${environment.apiUrl}/tipos-producto`;
  const productsUrl = `${environment.apiUrl}/productos`;
  const salesUrl = `${environment.apiUrl}/ventas`;

  const mockClients: Client[] = [{ id: 1, name: 'Cliente HornoRaíz', status: 'active' }];
  const mockTypes: ProductType[] = [{ id: 1, name: 'Panadería', status: 'active' }];
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Pan Baguette',
      price: 8500,
      stock: 25,
      quantity: 25,
      min_stock: 5,
      status: 'active',
    },
    {
      id: 2,
      name: 'Torta Chocolate',
      price: 45000,
      stock: 2,
      quantity: 2,
      min_stock: 5,
      status: 'active',
    },
  ];
  const mockSales: Sale[] = [
    { id: 1, client_id: 1, total: 17000, totalAmount: 17000, status: 'completed' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse y cargar datos consolidados en paralelo con forkJoin', () => {
    httpTesting.expectOne(clientsUrl).flush({ data: { items: mockClients } });
    httpTesting.expectOne(typesUrl).flush({ data: { items: mockTypes } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });

    expect(component).toBeTruthy();
    expect(component.clients().length).toBe(1);
    expect(component.typeCount()).toBe(1);
    expect(component.products().length).toBe(2);
    expect(component.sales().length).toBe(1);
    expect(component.revenue()).toBe(17000);
    expect(component.lowStock().length).toBe(1); // Torta con stock 2 <= 5
    expect(component.loading()).toBe(false);
  });
});
