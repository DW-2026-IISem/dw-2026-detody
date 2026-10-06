"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_product_dto_js_1 = require("../../../application/dto/create-product.dto.js");
const product_mapper_js_1 = require("../../../application/mappers/product.mapper.js");
const create_product_use_case_js_1 = require("../../../application/use-cases/create-product.use-case.js");
const get_product_by_id_use_case_js_1 = require("../../../application/use-cases/get-product-by-id.use-case.js");
const list_products_use_case_js_1 = require("../../../application/use-cases/list-products.use-case.js");
let ProductsController = class ProductsController {
    constructor(createProduct, listProducts, getProduct) {
        this.createProduct = createProduct;
        this.listProducts = listProducts;
        this.getProduct = getProduct;
    }
    async create(dto) {
        const item = await this.createProduct.execute(dto);
        return product_mapper_js_1.ProductMapper.toResponse(item);
    }
    async list(page = '1', limit = '10') {
        return this.listProducts.execute(Number(page), Number(limit));
    }
    async findOne(id) {
        const item = await this.getProduct.execute(id);
        return product_mapper_js_1.ProductMapper.toResponse(item);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_js_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [create_product_use_case_js_1.CreateProductUseCase,
        list_products_use_case_js_1.ListProductsUseCase,
        get_product_by_id_use_case_js_1.GetProductByIdUseCase])
], ProductsController);
//# sourceMappingURL=products.controller.js.map