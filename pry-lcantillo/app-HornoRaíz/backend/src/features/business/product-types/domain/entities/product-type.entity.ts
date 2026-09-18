export interface ProductTypeProps {
  id?: number | null;
  name: string;
  description?: string | null;
}

export class ProductType {
  readonly id: number | null;
  readonly name: string;
  readonly description: string | null;

  constructor(props: ProductTypeProps) {
    this.id = props.id ?? null;
    this.name = props.name;
    this.description = props.description ?? null;
  }
}
