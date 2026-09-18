import { Sale } from '../../domain/entities/sale.entity.js';
export declare class SaleMapper {
    static toResponse(sale: Sale): {
        id: number | null;
        clientId: number;
        totalAmount: number;
        status: "completed" | "cancelled";
        items: {
            id: number | null;
            productId: number;
            quantity: number;
            unitPrice: number;
            subtotal: number;
        }[];
    };
}
