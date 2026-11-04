import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserForm } from './user-form';
import { User, UserPayload } from '../../../../core/models';

describe('UserForm', () => {
  let component: UserForm;
  let fixture: ComponentFixture<UserForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UserForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse e inicializarse en modo nuevo con password y status activos', () => {
    expect(component).toBeTruthy();
    expect(component.form.controls.username.value).toBe('');
    expect(component.form.controls.email.value).toBe('');
    expect(component.form.controls.password.enabled).toBe(true);
    expect(component.form.controls.status.enabled).toBe(true);
  });

  it('no debe emitir saved si el formulario es inválido', () => {
    let emitted = false;
    component.saved.subscribe(() => (emitted = true));
    component.submit();
    expect(emitted).toBe(false);
    expect(component.form.invalid).toBe(true);
  });

  it('debe emitir saved con payload correcto al crear usuario', () => {
    let result: any = null;
    component.saved.subscribe((p: UserPayload) => (result = p));

    component.form.patchValue({
      username: 'jdoe',
      email: 'jdoe@hornoraiz.com',
      password: 'Password123*',
      status: 'active',
    });

    component.submit();
    expect(result).not.toBeNull();
    expect(result?.username).toBe('jdoe');
    expect(result?.email).toBe('jdoe@hornoraiz.com');
    expect(result?.password).toBe('Password123*');
    expect(result?.status).toBe('active');
  });

  it('debe deshabilitar password y status en modo edición', () => {
    const mockUser: User = {
      id: 5,
      username: 'editor',
      email: 'editor@hornoraiz.com',
      status: 'active',
    };

    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    expect(component.form.controls.username.value).toBe('editor');
    expect(component.form.controls.email.value).toBe('editor@hornoraiz.com');
    expect(component.form.controls.password.disabled).toBe(true);
    expect(component.form.controls.status.disabled).toBe(true);
  });
});
