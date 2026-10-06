"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sale = exports.SaleItem = void 0;
class SaleItem {
    constructor(props) {
        this.id = props.id ?? null;
        this.saleId = props.saleId ?? null;
        this.productId = props.productId;
        this.quantity = props.quantity;
        this.unitPrice = props.unitPrice;
        this.subtotal = props.subtotal ?? props.quantity * props.unitPrice;
    }
}
exports.SaleItem = SaleItem;
class Sale {
    constructor(props) {
        this.id = props.id ?? null;
        this.clientId = props.clientId;
        this.status = props.status ?? 'completed';
        this.items = (props.items ?? []).map((i) => new SaleItem(i));
        this.totalAmount = props.totalAmount ?? this.items.reduce((acc, item) => acc + item.subtotal, 0);
    }
}
exports.Sale = Sale;
//# sourceMappingURL=sale.entity.js.map