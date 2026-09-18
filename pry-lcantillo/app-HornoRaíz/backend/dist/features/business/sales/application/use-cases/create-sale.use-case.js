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
import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../../clients/domain/interfaces/client.repository.js';
import { ClientNotFoundException } from '../../../clients/domain/exceptions/client.exceptions.js';
import { PRODUCT_REPOSITORY } from '../../../products/domain/interfaces/product.repository.js';
import { ProductNotFoundException } from '../../../products/domain/exceptions/product.exceptions.js';
import { Sale } from '../../domain/entities/sale.entity.js';
import { EmptySaleItemsException, InsufficientStockException } from '../../domain/exceptions/sale.exceptions.js';
import { SALE_REPOSITORY } from '../../domain/interfaces/sale.repository.js';
let CreateSaleUseCase = class CreateSaleUseCase {
    saleRepository;
    clientRepository;
    productRepository;
    constructor(saleRepository, clientRepository, productRepository) {
        this.saleRepository = saleRepository;
        this.clientRepository = clientRepository;
        this.productRepository = productRepository;
    }
    async execute(dto) {
        if (!dto.items || dto.items.length === 0) {
            throw new EmptySaleItemsException();
        }
        const clientExists = await this.clientRepository.findById(dto.clientId);
        if (!clientExists) {
            throw new ClientNotFoundException(dto.clientId);
        }
        const preparedItems = [];
        for (const itemDto of dto.items) {
            const product = await this.productRepository.findById(itemDto.productId);
            if (!product) {
                throw new ProductNotFoundException(itemDto.productId);
            }
            if (product.stock < itemDto.quantity) {
                throw new InsufficientStockException(product.name, product.stock, itemDto.quantity);
            }
            preparedItems.push({
                productId: product.id,
                quantity: itemDto.quantity,
                unitPrice: product.price,
                subtotal: product.price * itemDto.quantity,
            });
        }
        const newSale = new Sale({
            clientId: dto.clientId,
            items: preparedItems,
            status: 'completed',
        });
        return this.saleRepository.create(newSale);
    }
};
CreateSaleUseCase = __decorate([
    Injectable(),
    __param(0, Inject(SALE_REPOSITORY)),
    __param(1, Inject(CLIENT_REPOSITORY)),
    __param(2, Inject(PRODUCT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateSaleUseCase);
export { CreateSaleUseCase };
//# sourceMappingURL=create-sale.use-case.js.map