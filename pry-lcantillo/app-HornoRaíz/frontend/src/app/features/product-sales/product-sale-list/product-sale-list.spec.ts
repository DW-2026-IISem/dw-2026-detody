import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../core/models/product.model';
import { ProductSale } from '../../../core/models/product-sale.model';
import { Sale } from '../../../core/models/sale.model';
import { NotificationService } from '../../../core/services/notification';
import { ProductSaleList } from './product-sale-list';

describe('ProductSaleList', () => {
  let component: ProductSaleList;
  let fixture: ComponentFixture<ProductSaleList>;
  let httpTesting: HttpTestingController;
  let confirmationService: ConfirmationService;

  const linesUrl = `${environment.apiUrl}/detalle-ventas`;
  const productsUrl = `${environment.apiUrl}/productos`;
  const salesUrl = `${environment.apiUrl}/ventas`;

  const mockLines: ProductSale[] = [
    {
      id: 1,
      sale_id: 1,
      product_id: 1,
      quantity: 2,
      unit_price: 8500,
      subtotal: 17000,
      status: 'active',
    },
  ];

  const mockProducts: Product[] = [
    { id: 1, name: 'Pan Baguette Masa Madre', price: 8500, stock: 20, status: 'active' },
  ];

  const mockSales: Sale[] = [{ id: 1, client_id: 1, total: 17000, status: 'completed' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSaleList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
        NotificationService,
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    confirmationService = TestBed.inject(ConfirmationService);

    fixture = TestBed.createComponent(ProductSaleList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse y cargar datos en paralelo con forkJoin', () => {
    httpTesting.expectOne(linesUrl).flush({ data: { items: mockLines } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });

    expect(component).toBeTruthy();
    expect(component.rows().length).toBe(1);
    expect(component.products().length).toBe(1);
    expect(component.sales().length).toBe(1);
    expect(component.loading()).toBe(false);
  });

  it('debe resolver el nombre del producto con Map memorizado', () => {
    httpTesting.expectOne(linesUrl).flush({ data: { items: mockLines } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });

    expect(component.productName()(1)).toBe('Pan Baguette Masa Madre');
    expect(component.productName()(99)).toBe('Producto #99');
  });

  it('debe abrir modal para nueva línea y para editar línea', () => {
    httpTesting.expectOne(linesUrl).flush({ data: { items: mockLines } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });

    component.openCreate();
    expect(component.editing()).toBeNull();
    expect(component.dialogVisible()).toBe(true);

    component.openEdit(mockLines[0]);
    expect(component.editing()).toEqual(mockLines[0]);
    expect(component.dialogVisible()).toBe(true);
  });

  it('debe anular línea vía PATCH /:id/deactivate', () => {
    httpTesting.expectOne(linesUrl).flush({ data: { items: mockLines } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });

    vi.spyOn(confirmationService, 'confirm').mockImplementation((conf: any) => {
      if (conf.accept) conf.accept();
      return confirmationService;
    });

    component.deactivate(mockLines[0]);

    const req = httpTesting.expectOne(`${linesUrl}/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});

    httpTesting.expectOne(linesUrl).flush({ data: { items: [] } });
    httpTesting.expectOne(productsUrl).flush({ data: { items: mockProducts } });
    httpTesting.expectOne(salesUrl).flush({ data: { items: mockSales } });

    expect(component.rows().length).toBe(0);
  });
});
