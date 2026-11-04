import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Shell } from './shell';
import { SessionStore } from '../../core/services/session-store';

describe('Shell', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;
  let sessionStore: SessionStore;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    sessionStore = TestBed.inject(SessionStore);
    sessionStore.setAccess({
      user: { id: 1, username: 'admin', email: 'admin@hornoraiz.com', status: 'active' },
      permissions: [
        {
          resource_id: 1,
          method: 'GET',
          path: '/api/clientes',
          description: null,
          role_id: 1,
          role_name: 'ADMIN',
        },
      ],
    });

    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe contener items de menú configurados', () => {
    expect(component.navGroups().length).toBeGreaterThan(0);
    const labels = component.navGroups().map((i: any) => i.label);
    expect(labels).toContain('Operación');
  });

  it('debe alternar el estado del menú móvil', () => {
    expect(component.mobileOpen()).toBe(false);
    component.onMenuToggle();
    expect(component.mobileOpen()).toBe(true);
    component.onMenuToggle();
    expect(component.mobileOpen()).toBe(false);
  });
});
