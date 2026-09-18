import { type ISaleRepository } from '../../domain/interfaces/sale.repository.js';
export declare class ListSalesUseCase {
    private readonly saleRepository;
    constructor(saleRepository: ISaleRepository);
    execute(page: number, limit: number): Promise<{
        items: {
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
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
