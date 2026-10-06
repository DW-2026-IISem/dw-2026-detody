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
exports.ProductTypesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_product_type_dto_js_1 = require("../../../application/dto/create-product-type.dto.js");
const product_type_mapper_js_1 = require("../../../application/mappers/product-type.mapper.js");
const create_product_type_use_case_js_1 = require("../../../application/use-cases/create-product-type.use-case.js");
const get_product_type_by_id_use_case_js_1 = require("../../../application/use-cases/get-product-type-by-id.use-case.js");
const list_product_types_use_case_js_1 = require("../../../application/use-cases/list-product-types.use-case.js");
let ProductTypesController = class ProductTypesController {
    constructor(createProductType, listProductTypes, getProductType) {
        this.createProductType = createProductType;
        this.listProductTypes = listProductTypes;
        this.getProductType = getProductType;
    }
    async create(dto) {
        const item = await this.createProductType.execute(dto);
        return product_type_mapper_js_1.ProductTypeMapper.toResponse(item);
    }
    async list(page = '1', limit = '10') {
        return this.listProductTypes.execute(Number(page), Number(limit));
    }
    async findOne(id) {
        const item = await this.getProductType.execute(id);
        return product_type_mapper_js_1.ProductTypeMapper.toResponse(item);
    }
};
exports.ProductTypesController = ProductTypesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_type_dto_js_1.CreateProductTypeDto]),
    __metadata("design:returntype", Promise)
], ProductTypesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductTypesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductTypesController.prototype, "findOne", null);
exports.ProductTypesController = ProductTypesController = __decorate([
    (0, swagger_1.ApiTags)('product-types'),
    (0, common_1.Controller)('product-types'),
    __metadata("design:paramtypes", [create_product_type_use_case_js_1.CreateProductTypeUseCase,
        list_product_types_use_case_js_1.ListProductTypesUseCase,
        get_product_type_by_id_use_case_js_1.GetProductTypeByIdUseCase])
], ProductTypesController);
//# sourceMappingURL=product-types.controller.js.map