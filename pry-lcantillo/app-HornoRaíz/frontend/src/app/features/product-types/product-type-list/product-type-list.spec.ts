import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductTypeList } from './product-type-list';
import { environment } from '../../../../environments/environment';
import { ProductType, ProductTypePayload } from '../../../core/models/product-type.model';
import { NotificationService } from '../../../core/services/notification';

describe('ProductTypeList', () => {
  let component: ProductTypeList;
  let fixture: ComponentFixture<ProductTypeList>;
  let httpTesting: HttpTestingController;
  let confirmationService: ConfirmationService;
  let notifyService: NotificationService;
  const baseUrl = `${environment.apiUrl}/tipos-producto`;

  const TYPES: ProductType[] = [
    { id: 1, name: 'Panadería Tradicional', description: 'Panes de uso diario, aliñados', status: 'active' },
    { id: 2, name: 'Pastelería y Repostería', description: 'Tortas y postres finos', status: 'active' },
    { id: 3, name: 'Bebidas e Infusiones', description: 'Cafés y jugos naturales', status: 'active' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTypeList],
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

    fixture = TestBed.createComponent(ProductTypeList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe cargar los tipos de producto al inicializarse (GET /api/tipos-producto)', () => {
    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ product_types: TYPES });

    expect(component.rows().length).toBe(3);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('debe manejar error de carga vaciando las filas y mostrando mensaje en error signal', () => {
    const req = httpTesting.expectOne(baseUrl);
    req.flush({ message: 'Error de servidor' }, { status: 500, statusText: 'Internal Server Error' });

    expect(component.rows().length).toBe(0);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBe('Error de servidor');
  });

  it('debe filtrar tipos localmente con visibleRows sin llamadas HTTP adicionales', () => {
    httpTesting.expectOne(baseUrl).flush({ product_types: TYPES });

    component.filter.set('bebidas');
    expect(component.visibleRows().length).toBe(1);
    expect(component.visibleRows()[0].name).toBe('Bebidas e Infusiones');

    httpTesting.expectNone(`${baseUrl}?query=bebidas`);
  });

  it('debe abrir el diálogo en modo creación y aumentar resetKey', () => {
    httpTesting.expectOne(baseUrl).flush({ product_types: TYPES });

    component.openCreate();
    expect(component.dialogVisible()).toBe(true);
    expect(component.editing()).toBeNull();
    expect(component.resetKey()).toBe(1);
    expect(component.title()).toBe('Nuevo tipo');
  });

  it('debe abrir el diálogo en modo edición con el tipo seleccionado', () => {
    httpTesting.expectOne(baseUrl).flush({ product_types: TYPES });

    component.openEdit(TYPES[0]);
    expect(component.dialogVisible()).toBe(true);
    expect(component.editing()).toEqual(TYPES[0]);
    expect(component.resetKey()).toBe(1);
    expect(component.title()).toBe('Editar tipo');
  });

  it('debe realizar POST al crear un tipo y recargar la tabla', () => {
    httpTesting.expectOne(baseUrl).flush({ product_types: TYPES });

    const newPayload: ProductTypePayload = {
      name: 'Gourmet y Masas Madres',
      description: 'Panes rústicos de fermentación prolongada',
      status: 'active',
    };

    component.openCreate();
    component.save(newPayload);

    const postReq = httpTesting.expectOne(baseUrl);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual(newPayload);
    postReq.flush({ product_type: { id: 4, ...newPayload } });

    // Recarga posterior
    const reloadReq = httpTesting.expectOne(baseUrl);
    reloadReq.flush({ product_types: [...TYPES, { id: 4, ...newPayload }] });

    expect(component.dialogVisible()).toBe(false);
    expect(component.saving()).toBe(false);
    expect(component.rows().length).toBe(4);
  });

  it('debe realizar PATCH al editar un tipo y recargar la tabla', () => {
    httpTesting.expectOne(baseUrl).flush({ product_types: TYPES });

    const editPayload: Partial<ProductTypePayload> = {
      name: 'Panadería Tradicional Artesanal',
    };

    component.openEdit(TYPES[0]);
    component.save(editPayload as ProductTypePayload);

    const patchReq = httpTesting.expectOne(`${baseUrl}/1`);
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body).toEqual(editPayload);
    patchReq.flush({ product_type: { ...TYPES[0], ...editPayload } });

    // Recarga posterior
    const reloadReq = httpTesting.expectOne(baseUrl);
    reloadReq.flush({ product_types: [{ ...TYPES[0], ...editPayload }, TYPES[1], TYPES[2]] });

    expect(component.dialogVisible()).toBe(false);
  });

  it('debe manejar error al guardar mostrando toast de error y manteniendo abierto el diálogo', () => {
    httpTesting.expectOne(baseUrl).flush({ product_types: TYPES });

    const errorSpy = vi.spyOn(notifyService, 'error');
    component.openCreate();
    component.save({ name: 'Tipo Error', status: 'active' });

    const postReq = httpTesting.expectOne(baseUrl);
    postReq.flush({ message: 'Error interno en la BD' }, { status: 500, statusText: 'Server Error' });

    expect(component.saving()).toBe(false);
    expect(component.dialogVisible()).toBe(true);
    expect(errorSpy).toHaveBeenCalledWith('No se pudo guardar', 'Error interno en la BD');
  });

  it('debe ejecutar la baja lógica PATCH /:id/deactivate tras aceptar confirmación', () => {
    httpTesting.expectOne(baseUrl).flush({ product_types: TYPES });

    vi.spyOn(confirmationService, 'confirm').mockImplementation((conf: any) => {
      if (conf.accept) conf.accept();
      return confirmationService;
    });

    component.deactivate(TYPES[0]);

    const deactReq = httpTesting.expectOne(`${baseUrl}/1/deactivate`);
    expect(deactReq.request.method).toBe('PATCH');
    deactReq.flush({ product_type: { ...TYPES[0], status: 'inactive' } });

    // Recarga posterior
    httpTesting.expectOne(baseUrl).flush({ product_types: TYPES.slice(1) });
    expect(component.rows().length).toBe(2);
  });

  it('debe ejecutar la baja física DELETE /:id tras aceptar confirmación', () => {
    httpTesting.expectOne(baseUrl).flush({ product_types: TYPES });

    vi.spyOn(confirmationService, 'confirm').mockImplementation((conf: any) => {
      if (conf.accept) conf.accept();
      return confirmationService;
    });

    component.remove(TYPES[0]);

    const delReq = httpTesting.expectOne(`${baseUrl}/1`);
    expect(delReq.request.method).toBe('DELETE');
    delReq.flush(null);

    // Recarga posterior
    httpTesting.expectOne(baseUrl).flush({ product_types: TYPES.slice(1) });
    expect(component.rows().length).toBe(2);
  });
});
