"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypeMapper = void 0;
const product_type_entity_js_1 = require("../../domain/entities/product-type.entity.js");
class ProductTypeMapper {
    static toEntity(dto) {
        return new product_type_entity_js_1.ProductType({
            name: dto.name,
            description: dto.description ?? null,
        });
    }
    static toResponse(productType) {
        return {
            id: productType.id,
            name: productType.name,
            description: productType.description,
        };
    }
}
exports.ProductTypeMapper = ProductTypeMapper;
//# sourceMappingURL=product-type.mapper.js.map