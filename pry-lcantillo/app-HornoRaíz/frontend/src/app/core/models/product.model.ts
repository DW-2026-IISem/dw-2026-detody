import { Money, Status, Timestamps } from './api.model';
import { ProductType } from './product-type.model';

export interface Product extends Timestamps {
  id: number;
  name: string;
  brand?: string;
  description?: string | null;
  price: Money;
  min_stock?: number;
  quantity?: number;
  stock?: number;
  product_type_id?: number;
  productTypeId?: number;
  status: Status;
  product_type?: ProductType;
  productType?: ProductType;
}

export interface ProductPayload {
  name: string;
  brand?: string;
  description?: string | null;
  price: Money;
  min_stock?: number;
  quantity?: number;
  stock?: number;
  product_type_id?: number;
  productTypeId?: number;
  status?: Status;
}
