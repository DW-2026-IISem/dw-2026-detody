"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(props) {
        this.id = props.id ?? null;
        this.name = props.name;
        this.description = props.description ?? null;
        this.price = props.price;
        this.stock = props.stock ?? 0;
        this.productTypeId = props.productTypeId;
        this.status = props.status ?? 'active';
    }
}
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map