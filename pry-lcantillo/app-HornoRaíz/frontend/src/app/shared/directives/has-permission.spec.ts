import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HasPermission } from './has-permission';
import { SessionStore } from '../../core/services/session-store';

@Component({
  standalone: true,
  imports: [HasPermission],
  template: `
    <button id="btn-create" *appHasPermission="'POST /api/clientes'">Crear Cliente</button>
    <button id="btn-delete" *appHasPermission="'DELETE /api/clientes/:id'">Eliminar Cliente</button>
  `,
})
class TestHostComponent {}

describe('HasPermission Directive', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let sessionStore: SessionStore;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    sessionStore = TestBed.inject(SessionStore);
    sessionStore.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe mostrar únicamente los elementos para los cuales la sesión tiene permiso', () => {
    sessionStore.setAccess({
      user: { id: 1, username: 'admin', email: 'admin@hornoraiz.com', status: 'active' },
      permissions: [
        {
          resource_id: 1,
          method: 'POST',
          path: '/api/clientes',
          description: null,
          role_id: 1,
          role_name: 'ADMIN',
        },
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#btn-create')).toBeTruthy();
    expect(compiled.querySelector('#btn-delete')).toBeNull();
  });

  it('debe ocultar todos los elementos si el usuario no tiene permisos', () => {
    sessionStore.setAccess({
      user: { id: 2, username: 'guest', email: 'guest@hornoraiz.com', status: 'active' },
      permissions: [],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#btn-create')).toBeNull();
    expect(compiled.querySelector('#btn-delete')).toBeNull();
  });
});
