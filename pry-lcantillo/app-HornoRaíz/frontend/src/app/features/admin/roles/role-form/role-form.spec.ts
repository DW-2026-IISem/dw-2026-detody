import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleForm } from './role-form';
import { Role, RolePayload } from '../../../../core/models';

describe('RoleForm', () => {
  let component: RoleForm;
  let fixture: ComponentFixture<RoleForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse con formulario vacío en modo nuevo', () => {
    expect(component).toBeTruthy();
    expect(component.form.controls.name.value).toBe('');
    expect(component.form.controls.status.value).toBe('active');
  });

  it('debe emitir saved con nombre normalizado a mayúsculas', () => {
    let result: any = null;
    component.saved.subscribe((p: RolePayload) => (result = p));

    component.form.patchValue({
      name: 'supervisor_turnos',
      description: 'Supervisa producción',
    });

    component.submit();
    expect(result).not.toBeNull();
    expect(result?.name).toBe('SUPERVISOR_TURNOS');
  });

  it('debe deshabilitar status en modo edición', () => {
    const role: Role = { id: 3, name: 'AUDITOR', description: 'Auditoría', status: 'active' };
    fixture.componentRef.setInput('role', role);
    fixture.detectChanges();

    expect(component.form.controls.name.value).toBe('AUDITOR');
    expect(component.form.controls.status.disabled).toBe(true);
  });
});
