"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMapper = void 0;
const product_entity_js_1 = require("../../domain/entities/product.entity.js");
class ProductMapper {
    static toEntity(dto) {
        return new product_entity_js_1.Product({
            name: dto.name,
            description: dto.description ?? null,
            price: dto.price,
            stock: dto.stock,
            productTypeId: dto.productTypeId,
            status: 'active',
        });
    }
    static toResponse(product) {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            productTypeId: product.productTypeId,
            status: product.status,
        };
    }
}
exports.ProductMapper = ProductMapper;
//# sourceMappingURL=product.mapper.js.map