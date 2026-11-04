import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSaleForm } from './product-sale-form';
import { Product } from '../../../core/models/product.model';
import { ProductSale } from '../../../core/models/product-sale.model';
import { Sale } from '../../../core/models/sale.model';

describe('ProductSaleForm', () => {
  let component: ProductSaleForm;
  let fixture: ComponentFixture<ProductSaleForm>;

  const mockProducts: Product[] = [
    { id: 1, name: 'Pan Baguette', price: 8500, stock: 20, status: 'active' },
  ];

  const mockSales: Sale[] = [{ id: 1, client_id: 1, total: 17000, status: 'completed' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSaleForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSaleForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('products', mockProducts);
    fixture.componentRef.setInput('sales', mockSales);
    fixture.detectChanges();
  });

  it('debe crearse e inicializarse en modo nuevo', () => {
    expect(component).toBeTruthy();
    expect(component.form.controls.sale_id.enabled).toBe(true);
    expect(component.form.controls.product_id.enabled).toBe(true);
  });

  it('debe bloquear sale_id y product_id al editar una línea existente', () => {
    const line: ProductSale = {
      id: 10,
      sale_id: 1,
      product_id: 1,
      quantity: 3,
      unit_price: 8500,
      subtotal: 25500,
      status: 'active',
    };

    fixture.componentRef.setInput('line', line);
    fixture.detectChanges();

    expect(component.form.controls.sale_id.value).toBe(1);
    expect(component.form.controls.product_id.value).toBe(1);
    expect(component.form.controls.quantity.value).toBe(3);
    expect(component.form.controls.sale_id.disabled).toBe(true);
    expect(component.form.controls.product_id.disabled).toBe(true);
  });

  it('debe emitir saved con payload válido', () => {
    let result: any = null;
    component.saved.subscribe((val) => (result = val));

    component.form.patchValue({
      sale_id: 1,
      product_id: 1,
      quantity: 5,
    });

    component.submit();
    expect(result).toBeTruthy();
    expect(result.sale_id).toBe(1);
    expect(result.quantity).toBe(5);
  });
});
