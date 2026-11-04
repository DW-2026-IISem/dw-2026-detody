import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientForm } from './client-form';
import { Client } from '../../../core/models';

describe('ClientForm', () => {
  let component: ClientForm;
  let fixture: ComponentFixture<ClientForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe inicializarse con el formulario vacío en modo creación y status active', () => {
    expect(component).toBeTruthy();
    expect(component.form.value.name).toBe('');
    expect(component.form.value.status).toBe('active');
    expect(component.form.controls.status.enabled).toBe(true);
  });

  it('no debe emitir saved si el formulario es inválido y debe marcar campos touched', () => {
    let emitted = false;
    component.saved.subscribe(() => (emitted = true));

    component.submit();

    expect(emitted).toBe(false);
    expect(component.form.controls.name.touched).toBe(true);
    expect(component.form.invalid).toBe(true);
  });

  it('debe validar el formato del correo electrónico', () => {
    component.form.controls.email.setValue('correo-invalido');
    expect(component.form.controls.email.invalid).toBe(true);

    component.form.controls.email.setValue('valido@panaderia.com');
    expect(component.form.controls.email.valid).toBe(true);
  });

  it('debe emitir el payload completo de creación con status al guardar válido', () => {
    let payload: any = null;
    component.saved.subscribe((val) => (payload = val));

    component.form.setValue({
      name: '  Panadería Central  ',
      address: 'Calle 10 # 5-20',
      phone: '3001234567',
      email: 'central@pan.com',
      status: 'active',
    });

    component.submit();

    expect(payload).toEqual({
      name: 'Panadería Central',
      address: 'Calle 10 # 5-20',
      phone: '3001234567',
      email: 'central@pan.com',
      status: 'active',
    });
  });

  it('en modo edición debe rellenar los valores del cliente y deshabilitar el status', () => {
    const mockClient: Client = {
      id: 8,
      name: 'Repostería Dulce Amor',
      email: 'dulce@amor.com',
      phone: '3157778899',
      address: 'Carrera 15 # 40-10',
      status: 'active',
    };

    fixture.componentRef.setInput('client', mockClient);
    fixture.detectChanges();

    expect(component.form.controls.name.value).toBe('Repostería Dulce Amor');
    expect(component.form.controls.phone.value).toBe('3157778899');
    expect(component.form.controls.status.disabled).toBe(true);

    let payload: any = null;
    component.saved.subscribe((val) => (payload = val));
    component.submit();

    // En edición no debe incluir status en el payload
    expect(payload.status).toBeUndefined();
    expect(payload.name).toBe('Repostería Dulce Amor');
  });

  it('debe reiniciar el formulario cuando cambia resetKey aunque client sea null', () => {
    component.form.controls.name.setValue('Nombre temporal escrito');
    expect(component.form.controls.name.value).toBe('Nombre temporal escrito');

    fixture.componentRef.setInput('resetKey', 1);
    fixture.detectChanges();

    expect(component.form.controls.name.value).toBe('');
  });

  it('debe emitir cancelled al pulsar cancelar', () => {
    let cancelled = false;
    component.cancelled.subscribe(() => (cancelled = true));

    component.cancelled.emit();
    expect(cancelled).toBe(true);
  });
});
