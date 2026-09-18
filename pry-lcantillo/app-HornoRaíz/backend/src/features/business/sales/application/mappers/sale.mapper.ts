import { Sale } from '../../domain/entities/sale.entity.js';

export class SaleMapper {
  static toResponse(sale: Sale) {
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
