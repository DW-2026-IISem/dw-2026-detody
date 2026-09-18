export interface SaleItemProps {
  id?: number | null;
  saleId?: number | null;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export class SaleItem {
  readonly id: number | null;
  readonly saleId: number | null;
  readonly productId: number;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly subtotal: number;

  constructor(props: SaleItemProps) {
    this.id = props.id ?? null;
    this.saleId = props.saleId ?? null;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.subtotal = props.subtotal ?? props.quantity * props.unitPrice;
  }
}
export interface SaleProps {
  id?: number | null;
  clientId: number;
  totalAmount?: number;
  status?: 'completed' | 'cancelled';
  items: SaleItemProps[];
}

export class Sale {
  readonly id: number | null;
  readonly clientId: number;
  readonly totalAmount: number;
  readonly status: 'completed' | 'cancelled';
  readonly items: SaleItem[];

  constructor(props: SaleProps) {
    this.id = props.id ?? null;
    this.clientId = props.clientId;
    this.status = props.status ?? 'completed';
    this.items = (props.items ?? []).map((i) => new SaleItem(i));
    this.totalAmount = props.totalAmount ?? this.items.reduce((acc, item) => acc + item.subtotal, 0);
  }
}
