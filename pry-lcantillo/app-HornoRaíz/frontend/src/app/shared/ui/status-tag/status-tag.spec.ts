import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusTag } from './status-tag';

describe('StatusTag', () => {
  let component: StatusTag;
  let fixture: ComponentFixture<StatusTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusTag],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusTag);
    component = fixture.componentInstance;
  });

  it('debe crearse correctamente', () => {
    fixture.componentRef.setInput('status', 'active');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debe mostrar "Activo" con severidad "success" para estado active', () => {
    fixture.componentRef.setInput('status', 'active');
    fixture.detectChanges();
    expect(component.label()).toBe('Activo');
    expect(component.severity()).toBe('success');
  });

  it('debe mostrar "Inactivo" con severidad "danger" para estado inactive', () => {
    fixture.componentRef.setInput('status', 'inactive');
    fixture.detectChanges();
    expect(component.label()).toBe('Inactivo');
    expect(component.severity()).toBe('danger');
  });

  it('debe manejar otros valores con severidad secondary', () => {
    fixture.componentRef.setInput('status', 'custom');
    fixture.detectChanges();
    expect(component.label()).toBe('custom');
    expect(component.severity()).toBe('secondary');
  });
});
