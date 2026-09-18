export interface SaleItemProps {
    id?: number | null;
    saleId?: number | null;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal?: number;
}
export declare class SaleItem {
    readonly id: number | null;
    readonly saleId: number | null;
    readonly productId: number;
    readonly quantity: number;
    readonly unitPrice: number;
    readonly subtotal: number;
    constructor(props: SaleItemProps);
}
export interface SaleProps {
    id?: number | null;
    clientId: number;
    totalAmount?: number;
    status?: 'completed' | 'cancelled';
    items: SaleItemProps[];
}
export declare class Sale {
    readonly id: number | null;
    readonly clientId: number;
    readonly totalAmount: number;
    readonly status: 'completed' | 'cancelled';
    readonly items: SaleItem[];
    constructor(props: SaleProps);
}
