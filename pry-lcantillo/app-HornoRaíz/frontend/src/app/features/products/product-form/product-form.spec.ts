import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductForm } from './product-form';
import { Product } from '../../../core/models/product.model';
import { ProductType } from '../../../core/models/product-type.model';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;

  const mockTypes: ProductType[] = [
    { id: 1, name: 'Panadería', status: 'active' },
    { id: 2, name: 'Pastelería', status: 'active' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('productTypes', mockTypes);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
  });

  it('debe inicializarse inválido cuando está vacío', () => {
    expect(component.form.valid).toBe(false);
  });

  it('debe poblar el formulario cuando recibe un producto', () => {
    const product: Product = {
      id: 10,
      name: 'Croissant Francés',
      brand: 'HornoRaíz',
      price: 6500,
      min_stock: 5,
      quantity: 12,
      product_type_id: 1,
      status: 'active',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-01',
    };

    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();

    expect(component.form.controls.name.value).toBe('Croissant Francés');
    expect(component.form.controls.price.value).toBe(6500);
    expect(component.form.controls.product_type_id.value).toBe(1);
    expect(component.form.controls.status.disabled).toBe(true);
  });

  it('no debe emitir saved si el formulario es inválido', () => {
    let emitted = false;
    component.saved.subscribe(() => (emitted = true));

    component.submit();
    expect(emitted).toBe(false);
  });

  it('debe emitir saved con payload válido', () => {
    let resultPayload: any = null;
    component.saved.subscribe((payload) => (resultPayload = payload));

    component.form.patchValue({
      name: 'Pan Campesino',
      brand: 'HornoRaíz',
      price: 8000,
      min_stock: 4,
      quantity: 20,
      product_type_id: 1,
    });

    component.submit();
    expect(resultPayload).toBeTruthy();
    expect(resultPayload.name).toBe('Pan Campesino');
    expect(resultPayload.price).toBe(8000);
    expect(resultPayload.product_type_id).toBe(1);
  });

  it('debe emitir cancelled al cancelar', () => {
    let cancelled = false;
    component.cancelled.subscribe(() => (cancelled = true));

    component.cancelled.emit();
    expect(cancelled).toBe(true);
  });
});
