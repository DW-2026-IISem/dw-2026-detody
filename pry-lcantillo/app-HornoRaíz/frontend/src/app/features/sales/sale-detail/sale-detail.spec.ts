import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleDetail } from './sale-detail';
import { Product } from '../../../core/models/product.model';
import { Sale } from '../../../core/models/sale.model';

describe('SaleDetail', () => {
  let component: SaleDetail;
  let fixture: ComponentFixture<SaleDetail>;

  const mockProducts: Product[] = [
    { id: 1, name: 'Pan Baguette', price: 8500, stock: 10, status: 'active' },
  ];

  const mockSale: Sale = {
    id: 1,
    client_id: 1,
    total: 17000,
    status: 'completed',
    items: [{ id: 1, product_id: 1, quantity: 2, unit_price: 8500, subtotal: 17000 }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SaleDetail);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('sale', mockSale);
    fixture.componentRef.setInput('products', mockProducts);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(component.itemCount()).toBe(2);
    expect(component.productName()(1)).toBe('Pan Baguette');
  });
});
