export class Product {
    id;
    name;
    description;
    price;
    stock;
    productTypeId;
    status;
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
//# sourceMappingURL=product.entity.js.map