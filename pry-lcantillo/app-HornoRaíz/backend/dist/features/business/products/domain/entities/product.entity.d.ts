export interface ProductProps {
    id?: number | null;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    productTypeId: number;
    status?: 'active' | 'inactive';
}
export declare class Product {
    readonly id: number | null;
    readonly name: string;
    readonly description: string | null;
    readonly price: number;
    readonly stock: number;
    readonly productTypeId: number;
    readonly status: 'active' | 'inactive';
    constructor(props: ProductProps);
}
