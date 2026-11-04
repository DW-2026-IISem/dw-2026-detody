import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Shell } from './shell';

describe('Shell', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe contener items de menú configurados', () => {
    expect(component.items.length).toBeGreaterThan(0);
    const labels = component.items.map((i) => i.label);
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
