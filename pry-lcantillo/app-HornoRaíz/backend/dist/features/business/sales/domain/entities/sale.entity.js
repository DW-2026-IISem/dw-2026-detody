export class SaleItem {
    id;
    saleId;
    productId;
    quantity;
    unitPrice;
    subtotal;
    constructor(props) {
        this.id = props.id ?? null;
        this.saleId = props.saleId ?? null;
        this.productId = props.productId;
        this.quantity = props.quantity;
        this.unitPrice = props.unitPrice;
        this.subtotal = props.subtotal ?? props.quantity * props.unitPrice;
    }
}
export class Sale {
    id;
    clientId;
    totalAmount;
    status;
    items;
    constructor(props) {
        this.id = props.id ?? null;
        this.clientId = props.clientId;
        this.status = props.status ?? 'completed';
        this.items = (props.items ?? []).map((i) => new SaleItem(i));
        this.totalAmount = props.totalAmount ?? this.items.reduce((acc, item) => acc + item.subtotal, 0);
    }
}
//# sourceMappingURL=sale.entity.js.map