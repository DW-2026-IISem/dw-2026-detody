import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClientList } from './client-list';
import { environment } from '../../../../environments/environment';
import { Client, ClientPayload } from '../../../core/models';
import { NotificationService } from '../../../core/services/notification';

describe('ClientList', () => {
  let component: ClientList;
  let fixture: ComponentFixture<ClientList>;
  let httpTesting: HttpTestingController;
  let confirmationService: ConfirmationService;
  let notifyService: NotificationService;
  const baseUrl = `${environment.apiUrl}/clients`;

  const CLIENTS: Client[] = [
    {
      id: 1,
      name: 'Panadería Central',
      email: 'central@pan.com',
      phone: '3001112233',
      address: 'Calle 10 # 5',
      status: 'active',
    },
    {
      id: 2,
      name: 'Pastelería del Sur',
      email: 'sur@pan.com',
      phone: '3004445566',
      address: 'Carrera 8 # 20',
      status: 'active',
    },
    {
      id: 3,
      name: 'Café El Manantial',
      email: 'cafe@pan.com',
      phone: '3109998877',
      address: 'Avenida 4 # 12',
      status: 'active',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientList],
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

    fixture = TestBed.createComponent(ClientList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe cargar los clientes al inicializarse (GET /api/clients)', () => {
    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ items: CLIENTS });

    expect(component.rows().length).toBe(3);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('debe manejar error de carga vaciando las filas y mostrando el error', () => {
    const req = httpTesting.expectOne(baseUrl);
    req.flush({ message: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });

    expect(component.rows().length).toBe(0);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBe('Missing Bearer token');
  });

  it('debe filtrar clientes localmente mediante visibleRows sin llamadas HTTP adicionales', () => {
    httpTesting.expectOne(baseUrl).flush({ items: CLIENTS });

    component.filter.set('sur');
    expect(component.visibleRows().length).toBe(1);
    expect(component.visibleRows()[0].name).toBe('Pastelería del Sur');

    // No se generaron peticiones HTTP adicionales
    httpTesting.expectNone(`${baseUrl}?query=sur`);
  });

  it('debe abrir el diálogo en modo creación y aumentar resetKey', () => {
    httpTesting.expectOne(baseUrl).flush({ items: CLIENTS });

    component.openCreate();
    expect(component.dialogVisible()).toBe(true);
    expect(component.editing()).toBeNull();
    expect(component.resetKey()).toBe(1);
    expect(component.title()).toBe('Nuevo cliente');
  });

  it('debe abrir el diálogo en modo edición con el cliente seleccionado', () => {
    httpTesting.expectOne(baseUrl).flush({ items: CLIENTS });

    component.openEdit(CLIENTS[0]);
    expect(component.dialogVisible()).toBe(true);
    expect(component.editing()).toEqual(CLIENTS[0]);
    expect(component.resetKey()).toBe(1);
    expect(component.title()).toBe('Editar cliente');
  });

  it('debe realizar POST al crear un cliente y recargar la tabla', () => {
    httpTesting.expectOne(baseUrl).flush({ items: CLIENTS });

    const newPayload: ClientPayload = {
      name: 'Horno San Juan',
      address: 'Calle 100 # 20',
      phone: '3201112233',
      email: 'sanjuan@horno.com',
      status: 'active',
    };

    component.openCreate();
    component.save(newPayload);

    const postReq = httpTesting.expectOne(baseUrl);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual(newPayload);
    postReq.flush({ client: { id: 4, ...newPayload } });

    // Recarga posterior
    const reloadReq = httpTesting.expectOne(baseUrl);
    reloadReq.flush({ items: [...CLIENTS, { id: 4, ...newPayload }] });

    expect(component.dialogVisible()).toBe(false);
    expect(component.saving()).toBe(false);
    expect(component.rows().length).toBe(4);
  });

  it('debe realizar PATCH al editar un cliente y recargar la tabla', () => {
    httpTesting.expectOne(baseUrl).flush({ items: CLIENTS });

    const editPayload: Partial<ClientPayload> = {
      name: 'Panadería Central Editada',
      phone: '3009990000',
    };

    component.openEdit(CLIENTS[0]);
    component.save(editPayload as ClientPayload);

    const patchReq = httpTesting.expectOne(`${baseUrl}/1`);
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body).toEqual(editPayload);
    patchReq.flush({ client: { ...CLIENTS[0], ...editPayload } });

    // Recarga posterior
    const reloadReq = httpTesting.expectOne(baseUrl);
    reloadReq.flush({ items: [{ ...CLIENTS[0], ...editPayload }, CLIENTS[1], CLIENTS[2]] });

    expect(component.dialogVisible()).toBe(false);
  });

  it('debe manejar error al guardar mostrando toast de error y manteniendo abierto el diálogo', () => {
    httpTesting.expectOne(baseUrl).flush({ items: CLIENTS });

    const errorSpy = vi.spyOn(notifyService, 'error');
    component.openCreate();
    component.save({ name: 'Cliente Error', status: 'active' });

    const postReq = httpTesting.expectOne(baseUrl);
    postReq.flush(
      { message: 'Error interno al guardar cliente' },
      { status: 500, statusText: 'Server Error' },
    );

    expect(component.saving()).toBe(false);
    expect(component.dialogVisible()).toBe(true);
    expect(errorSpy).toHaveBeenCalledWith('No se pudo guardar', 'Error interno al guardar cliente');
  });

  it('debe ejecutar la baja lógica PATCH /:id/deactivate tras aceptar confirmación', () => {
    httpTesting.expectOne(baseUrl).flush({ items: CLIENTS });

    vi.spyOn(confirmationService, 'confirm').mockImplementation((conf: any) => {
      if (conf.accept) conf.accept();
      return confirmationService;
    });

    component.deactivate(CLIENTS[0]);

    const deactReq = httpTesting.expectOne(`${baseUrl}/1/deactivate`);
    expect(deactReq.request.method).toBe('PATCH');
    deactReq.flush({ message: 'Client deactivated' });

    // Recarga posterior
    httpTesting.expectOne(baseUrl).flush({ items: CLIENTS.slice(1) });
    expect(component.rows().length).toBe(2);
  });

  it('debe ejecutar la baja física DELETE /:id tras aceptar confirmación', () => {
    httpTesting.expectOne(baseUrl).flush({ items: CLIENTS });

    vi.spyOn(confirmationService, 'confirm').mockImplementation((conf: any) => {
      if (conf.accept) conf.accept();
      return confirmationService;
    });

    component.remove(CLIENTS[0]);

    const delReq = httpTesting.expectOne(`${baseUrl}/1`);
    expect(delReq.request.method).toBe('DELETE');
    delReq.flush(null);

    // Recarga posterior
    httpTesting.expectOne(baseUrl).flush({ items: CLIENTS.slice(1) });
    expect(component.rows().length).toBe(2);
  });
});
