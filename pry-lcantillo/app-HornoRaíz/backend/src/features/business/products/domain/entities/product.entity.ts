export interface ProductProps {
  id?: number | null;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  productTypeId: number;
  status?: 'active' | 'inactive';
}

export class Product {
  readonly id: number | null;
  readonly name: string;
  readonly description: string | null;
  readonly price: number;
  readonly stock: number;
  readonly productTypeId: number;
  readonly status: 'active' | 'inactive';

  constructor(props: ProductProps) {
    this.id = props.id ?? null;
    this.name = props.name;
    this.description = props.description ?? null;
    this.price = props.price;
    this.stock = props.stock ?? 0;
    this.productTypeId = props.productTypeId;
    this.status = props.status ?? 'active';
  }
}
