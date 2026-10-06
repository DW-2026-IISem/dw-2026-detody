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
exports.CreateSaleUseCase = void 0;
const common_1 = require("@nestjs/common");
const client_repository_js_1 = require("../../../clients/domain/interfaces/client.repository.js");
const client_exceptions_js_1 = require("../../../clients/domain/exceptions/client.exceptions.js");
const product_repository_js_1 = require("../../../products/domain/interfaces/product.repository.js");
const product_exceptions_js_1 = require("../../../products/domain/exceptions/product.exceptions.js");
const sale_entity_js_1 = require("../../domain/entities/sale.entity.js");
const sale_exceptions_js_1 = require("../../domain/exceptions/sale.exceptions.js");
const sale_repository_js_1 = require("../../domain/interfaces/sale.repository.js");
let CreateSaleUseCase = class CreateSaleUseCase {
    constructor(saleRepository, clientRepository, productRepository) {
        this.saleRepository = saleRepository;
        this.clientRepository = clientRepository;
        this.productRepository = productRepository;
    }
    async execute(dto) {
        if (!dto.items || dto.items.length === 0) {
            throw new sale_exceptions_js_1.EmptySaleItemsException();
        }
        const clientExists = await this.clientRepository.findById(dto.clientId);
        if (!clientExists) {
            throw new client_exceptions_js_1.ClientNotFoundException(dto.clientId);
        }
        const preparedItems = [];
        for (const itemDto of dto.items) {
            const product = await this.productRepository.findById(itemDto.productId);
            if (!product) {
                throw new product_exceptions_js_1.ProductNotFoundException(itemDto.productId);
            }
            if (product.stock < itemDto.quantity) {
                throw new sale_exceptions_js_1.InsufficientStockException(product.name, product.stock, itemDto.quantity);
            }
            preparedItems.push({
                productId: product.id,
                quantity: itemDto.quantity,
                unitPrice: product.price,
                subtotal: product.price * itemDto.quantity,
            });
        }
        const newSale = new sale_entity_js_1.Sale({
            clientId: dto.clientId,
            items: preparedItems,
            status: 'completed',
        });
        return this.saleRepository.create(newSale);
    }
};
exports.CreateSaleUseCase = CreateSaleUseCase;
exports.CreateSaleUseCase = CreateSaleUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(sale_repository_js_1.SALE_REPOSITORY)),
    __param(1, (0, common_1.Inject)(client_repository_js_1.CLIENT_REPOSITORY)),
    __param(2, (0, common_1.Inject)(product_repository_js_1.PRODUCT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateSaleUseCase);
//# sourceMappingURL=create-sale.use-case.js.map