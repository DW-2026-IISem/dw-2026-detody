import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Login } from './login';
import { AuthService } from '../../../core/services/auth';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([{ path: 'dashboard', component: class {} }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('debe crearse correctamente con formulario vacío', () => {
    expect(component).toBeTruthy();
    expect(component.form.valid).toBe(false);
  });

  it('debe marcar controles como touched si se envía formulario inválido', () => {
    component.submit();
    expect(component.form.controls.identifier.touched).toBe(true);
    expect(component.form.controls.password.touched).toBe(true);
  });

  it('debe llamar a auth.login() al enviar datos válidos', () => {
    const loginSpy = vi.spyOn(authService, 'login').mockReturnValue(
      of({
        user: { id: 1, username: 'admin', email: 'admin@hornoraiz.com', status: 'active' },
        permissions: [],
      }),
    );

    component.form.patchValue({ identifier: 'admin', password: 'password123' });
    component.submit();

    expect(loginSpy).toHaveBeenCalledWith({
      identifier: 'admin',
      password: 'password123',
    });
  });

  it('debe manejar error al fallar las credenciales', () => {
    vi.spyOn(authService, 'login').mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            error: { message: 'Credenciales inválidas' },
          }),
      ),
    );

    component.form.patchValue({ identifier: 'wrong', password: 'bad' });
    component.submit();

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe('Credenciales inválidas');
  });
});
