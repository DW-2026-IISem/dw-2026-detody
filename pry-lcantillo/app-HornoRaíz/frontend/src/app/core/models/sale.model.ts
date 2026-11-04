import { Money, Status, Timestamps } from './api.model';
import { Client } from './client.model';
import { Product } from './product.model';

export interface SaleItemInput {
  product_id?: number;
  productId?: number;
  quantity: number;
  unit_price?: Money;
  unitPrice?: Money;
}

export interface SaleItem extends Timestamps {
  id?: number;
  sale_id?: number;
  saleId?: number;
  product_id?: number;
  productId?: number;
  quantity: number;
  unit_price: Money;
  unitPrice?: Money;
  subtotal: Money;
  product?: Product;
}

export interface Sale extends Timestamps {
  id: number;
  client_id?: number;
  clientId?: number;
  total_amount?: Money;
  totalAmount?: Money;
  status: Status | 'pending' | 'completed' | 'cancelled';
  client?: Client;
  items?: SaleItem[];
}

export interface SaleCreatePayload {
  client_id?: number;
  clientId?: number;
  items: SaleItemInput[];
}

export interface SaleUpdatePayload {
  status?: Status | 'pending' | 'completed' | 'cancelled';
  client_id?: number;
  clientId?: number;
}
