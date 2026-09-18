export interface ProductTypeProps {
    id?: number | null;
    name: string;
    description?: string | null;
}
export declare class ProductType {
    readonly id: number | null;
    readonly name: string;
    readonly description: string | null;
    constructor(props: ProductTypeProps);
}
