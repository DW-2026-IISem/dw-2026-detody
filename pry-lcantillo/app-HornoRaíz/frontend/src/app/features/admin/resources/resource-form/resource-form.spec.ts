import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceForm } from './resource-form';
import { Resource, ResourcePayload } from '../../../../core/models';

describe('ResourceForm', () => {
  let component: ResourceForm;
  let fixture: ComponentFixture<ResourceForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse con valores por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.form.controls.method.value).toBe('GET');
    expect(component.form.controls.path.value).toBe('');
  });

  it('debe validar que la ruta empiece con /', () => {
    component.form.controls.path.setValue('ruta-sin-slash');
    expect(component.form.controls.path.invalid).toBe(true);

    component.form.controls.path.setValue('/api/recursos');
    expect(component.form.controls.path.valid).toBe(true);
  });

  it('debe emitir payload válido', () => {
    let result: any = null;
    component.saved.subscribe((p: ResourcePayload) => (result = p));

    component.form.patchValue({
      method: 'POST',
      path: '/api/reportes',
      description: 'Generar reportes',
    });

    component.submit();
    expect(result).not.toBeNull();
    expect(result?.method).toBe('POST');
    expect(result?.path).toBe('/api/reportes');
  });
});
