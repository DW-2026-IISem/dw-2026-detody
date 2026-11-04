import { TestBed } from '@angular/core/testing';
import { Ejemplo } from './ejemplo';

describe('Ejemplo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ejemplo],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Ejemplo);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with initial values', () => {
    const fixture = TestBed.createComponent(Ejemplo);
    const comp = fixture.componentInstance as any;
    expect(comp.producto().nombre).toBe('Café molido 500 g');
    expect(comp.producto().precio).toBe(18000);
    expect(comp.precioFinal()).toBe(21420);
    expect(comp.producto().activo).toBe(true);
  });

  it('should increment price by 1000 and recalculate priceFinal', () => {
    const fixture = TestBed.createComponent(Ejemplo);
    const comp = fixture.componentInstance as any;
    comp.variarPrecio(1000);
    expect(comp.producto().precio).toBe(19000);
    expect(comp.precioFinal()).toBe(22610);
  });

  it('should toggle active status and reset state', () => {
    const fixture = TestBed.createComponent(Ejemplo);
    const comp = fixture.componentInstance as any;
    comp.alternarEstado();
    expect(comp.producto().activo).toBe(false);
    expect(comp.estadoTexto()).toBe('Inactivo');
    comp.reiniciar();
    expect(comp.producto().activo).toBe(true);
    expect(comp.producto().precio).toBe(18000);
  });
});
