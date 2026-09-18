import { CreateSaleDto } from '../../../application/dto/create-sale.dto.js';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale.use-case.js';
import { GetSaleByIdUseCase } from '../../../application/use-cases/get-sale-by-id.use-case.js';
import { ListSalesUseCase } from '../../../application/use-cases/list-sales.use-case.js';
export declare class SalesController {
    private readonly createSale;
    private readonly listSales;
    private readonly getSale;
    constructor(createSale: CreateSaleUseCase, listSales: ListSalesUseCase, getSale: GetSaleByIdUseCase);
    create(dto: CreateSaleDto): Promise<{
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
    }>;
    list(page?: string, limit?: string): Promise<{
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
    findOne(id: number): Promise<{
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
    }>;
}
