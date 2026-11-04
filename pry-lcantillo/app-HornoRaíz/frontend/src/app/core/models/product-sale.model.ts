import { Money, Status, Timestamps } from './api.model';
import { Product } from './product.model';
import { Sale } from './sale.model';

export interface ProductSale extends Timestamps {
  id: number;
  sale_id?: number;
  saleId?: number;
  product_id?: number;
  productId?: number;
  quantity: number;
  unit_price: Money;
  unitPrice?: Money;
  subtotal: Money;
  status?: Status;
  sale?: Sale;
  product?: Product;
}

export interface ProductSalePayload {
  sale_id?: number;
  saleId?: number;
  product_id?: number;
  productId?: number;
  quantity: number;
  unit_price?: Money;
  unitPrice?: Money;
  status?: Status;
}
