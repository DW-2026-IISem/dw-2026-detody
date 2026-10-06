"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleMapper = void 0;
class SaleMapper {
    static toResponse(sale) {
        return {
            id: sale.id,
            clientId: sale.clientId,
            totalAmount: sale.totalAmount,
            status: sale.status,
            items: sale.items.map((i) => ({
                id: i.id,
                productId: i.productId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                subtotal: i.subtotal,
            })),
        };
    }
}
exports.SaleMapper = SaleMapper;
//# sourceMappingURL=sale.mapper.js.map