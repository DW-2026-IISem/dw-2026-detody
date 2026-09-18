export class SaleMapper {
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
//# sourceMappingURL=sale.mapper.js.map