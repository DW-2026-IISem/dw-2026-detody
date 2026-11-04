import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Product, ProductPayload } from '../../../core/models/product.model';
import { ProductType } from '../../../core/models/product-type.model';
import { NotificationService } from '../../../core/services/notification';
import { ProductList } from './product-list';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let httpTesting: HttpTestingController;
  let confirmationService: ConfirmationService;
  let notifyService: NotificationService;

  const productsUrl = `${environment.apiUrl}/productos`;
  const typesUrl = `${environment.apiUrl}/tipos-producto`;

  const mockTypes: ProductType[] = [
    { id: 1, name: 'Panadería Tradicional', status: 'active' },
    { id: 2, name: 'Pastelería Fina', status: 'active' },
  ];

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Pan Baguette Masa Madre',
      brand: 'HornoRaíz',
      price: 8500,
      stock: 28,
      quantity: 28,
      min_stock: 5,
      product_type_id: 1,
      status: 'active',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-01',
    },
    {
      id: 2,
      name: 'Torta de Chocolate',
      brand: 'HornoRaíz',
      price: 45000,
      stock: 3,
      quantity: 3,
      min_stock: 5,
      product_type_id: 2,
      status: 'active',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-01',
    },
    {
      id: 3,
      name: 'Croissant Francés',
      brand: 'HornoRaíz',
      price: 7200,
      stock: 0,
      quantity: 0,
      min_stock: 5,
      product_type_id: 1,
      status: 'active',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-01',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
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
    notifyService = TestBed.inject(NotificationService);

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse correctamente y cargar productos y tipos en paralelo con forkJoin', () => {
    // Al inicializarse, forkJoin dispara peticiones a productos y tipos
    const reqProd = httpTesting.expectOne(productsUrl);
    expect(reqProd.request.method).toBe('GET');
    reqProd.flush({ products: mockProducts });

    const reqTypes = httpTesting.expectOne(typesUrl);
    expect(reqTypes.request.method).toBe('GET');
    reqTypes.flush({ product_types: mockTypes });

    expect(component.rows().length).toBe(3);
    expect(component.types().length).toBe(2);
    expect(component.loading()).toBe(false);
  });

  it('debe resolver el nombre del tipo mediante el mapa memorizado con computed typeName', () => {
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    const resolver = component.typeName();
    expect(resolver(1)).toBe('Panadería Tradicional');
    expect(resolver(2)).toBe('Pastelería Fina');
    expect(resolver(99)).toBe('Tipo #99');
  });

  it('debe calcular lowStockCount para productos con stock menor o igual al mínimo', () => {
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    // mockProducts[1] tiene 3 <= 5 y mockProducts[2] tiene 0 <= 5 => total 2
    expect(component.lowStockCount()).toBe(2);
  });

  it('debe filtrar filas por texto del buscador sin llamadas HTTP adicionales', () => {
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    component.filter.set('Baguette');
    expect(component.visibleRows().length).toBe(1);
    expect(component.visibleRows()[0].name).toBe('Pan Baguette Masa Madre');
  });

  it('debe abrir modal para nuevo producto en openCreate', () => {
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    component.openCreate();
    expect(component.editing()).toBeNull();
    expect(component.dialogVisible()).toBe(true);
    expect(component.resetKey()).toBe(1);
    expect(component.title()).toBe('Nuevo producto');
  });

  it('debe abrir modal para editar en openEdit', () => {
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    component.openEdit(mockProducts[0]);
    expect(component.editing()).toEqual(mockProducts[0]);
    expect(component.dialogVisible()).toBe(true);
    expect(component.title()).toBe('Editar producto');
  });

  it('debe realizar POST al crear un producto y recargar', () => {
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    const newProdPayload: ProductPayload = {
      name: 'Pan de Centeno',
      brand: 'HornoRaíz',
      price: 9500,
      stock: 15,
      quantity: 15,
      min_stock: 5,
      product_type_id: 1,
    };

    component.openCreate();
    component.save(newProdPayload);

    const postReq = httpTesting.expectOne(productsUrl);
    expect(postReq.request.method).toBe('POST');
    postReq.flush({ product: { id: 4, ...newProdPayload } });

    // Recarga posterior en paralelo
    httpTesting.expectOne(productsUrl).flush({ products: [...mockProducts, { id: 4, ...newProdPayload }] });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    expect(component.dialogVisible()).toBe(false);
    expect(component.saving()).toBe(false);
    expect(component.rows().length).toBe(4);
  });

  it('debe realizar PATCH al editar un producto y recargar', () => {
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    component.openEdit(mockProducts[0]);
    component.save({ name: 'Pan Baguette Masa Madre', price: 10000 });

    const patchReq = httpTesting.expectOne(`${productsUrl}/1`);
    expect(patchReq.request.method).toBe('PATCH');
    patchReq.flush({ product: { ...mockProducts[0], price: 10000 } });

    // Recarga posterior
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    expect(component.dialogVisible()).toBe(false);
  });

  it('debe ejecutar la baja lógica PATCH /:id/deactivate tras confirmación', () => {
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    vi.spyOn(confirmationService, 'confirm').mockImplementation((conf: any) => {
      if (conf.accept) conf.accept();
      return confirmationService;
    });

    component.deactivate(mockProducts[0]);

    const deactReq = httpTesting.expectOne(`${productsUrl}/1/deactivate`);
    expect(deactReq.request.method).toBe('PATCH');
    deactReq.flush({});

    // Recarga
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts.slice(1) });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    expect(component.rows().length).toBe(2);
  });

  it('debe ejecutar la eliminación física DELETE /:id tras confirmación', () => {
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    vi.spyOn(confirmationService, 'confirm').mockImplementation((conf: any) => {
      if (conf.accept) conf.accept();
      return confirmationService;
    });

    component.remove(mockProducts[0]);

    const delReq = httpTesting.expectOne(`${productsUrl}/1`);
    expect(delReq.request.method).toBe('DELETE');
    delReq.flush({});

    // Recarga
    httpTesting.expectOne(productsUrl).flush({ products: mockProducts.slice(1) });
    httpTesting.expectOne(typesUrl).flush({ product_types: mockTypes });

    expect(component.rows().length).toBe(2);
  });
});
