import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTypeForm } from './product-type-form';
import { ProductType } from '../../../core/models';

describe('ProductTypeForm', () => {
  let component: ProductTypeForm;
  let fixture: ComponentFixture<ProductTypeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTypeForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTypeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe inicializarse con el formulario vacío en modo creación y status active', () => {
    expect(component).toBeTruthy();
    expect(component.form.value.name).toBe('');
    expect(component.form.value.status).toBe('active');
    expect(component.form.controls.status.enabled).toBe(true);
  });

  it('debe validar que el nombre sea obligatorio', () => {
    component.form.controls.name.setValue('');
    expect(component.form.controls.name.invalid).toBe(true);

    let emitted = false;
    component.saved.subscribe(() => (emitted = true));
    component.submit();
    expect(emitted).toBe(false);
  });

  it('debe validar que el nombre no supere 120 caracteres', () => {
    component.form.controls.name.setValue('A'.repeat(121));
    expect(component.form.controls.name.invalid).toBe(true);

    component.form.controls.name.setValue('A'.repeat(120));
    expect(component.form.controls.name.valid).toBe(true);
  });

  it('debe emitir el payload completo con status en modo creación', () => {
    let payload: any = null;
    component.saved.subscribe((val) => (payload = val));

    component.form.setValue({
      name: 'Panadería Fina',
      description: 'Panes de masa madre',
      status: 'active',
    });
    component.submit();

    expect(payload).toEqual({
      name: 'Panadería Fina',
      description: 'Panes de masa madre',
      status: 'active',
    });
  });

  it('en modo edición debe rellenar los valores y deshabilitar el status', () => {
    const mockType: ProductType = {
      id: 5,
      name: 'Tortas y Ponqués',
      description: 'Pastelería dulce artesanal',
      status: 'active',
    };

    fixture.componentRef.setInput('productType', mockType);
    fixture.detectChanges();

    expect(component.form.controls.name.value).toBe('Tortas y Ponqués');
    expect(component.form.controls.description.value).toBe('Pastelería dulce artesanal');
    expect(component.form.controls.status.disabled).toBe(true);
  });

  it('en modo edición no debe enviar el status en el payload de guardado', () => {
    const mockType: ProductType = {
      id: 5,
      name: 'Tortas y Ponqués',
      description: 'Pastelería dulce',
      status: 'active',
    };

    fixture.componentRef.setInput('productType', mockType);
    fixture.detectChanges();

    let payload: any = null;
    component.saved.subscribe((val) => (payload = val));
    component.submit();

    expect(payload.status).toBeUndefined();
    expect(payload.name).toBe('Tortas y Ponqués');
  });

  it('debe reiniciar los campos cuando cambia resetKey aunque productType sea null', () => {
    component.form.controls.name.setValue('Texto escrito');
    expect(component.form.controls.name.value).toBe('Texto escrito');

    fixture.componentRef.setInput('resetKey', 2);
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
