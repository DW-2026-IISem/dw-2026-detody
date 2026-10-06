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
exports.GetProductByIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const product_exceptions_js_1 = require("../../domain/exceptions/product.exceptions.js");
const product_repository_js_1 = require("../../domain/interfaces/product.repository.js");
let GetProductByIdUseCase = class GetProductByIdUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const item = await this.repository.findById(id);
        if (!item) {
            throw new product_exceptions_js_1.ProductNotFoundException(id);
        }
        return item;
    }
};
exports.GetProductByIdUseCase = GetProductByIdUseCase;
exports.GetProductByIdUseCase = GetProductByIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(product_repository_js_1.PRODUCT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetProductByIdUseCase);
//# sourceMappingURL=get-product-by-id.use-case.js.map