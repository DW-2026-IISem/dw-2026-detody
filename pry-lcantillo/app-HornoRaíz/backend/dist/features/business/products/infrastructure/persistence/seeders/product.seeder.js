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
var ProductSeeder_1;
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity.js';
import { PRODUCT_REPOSITORY } from '../../../domain/interfaces/product.repository.js';
let ProductSeeder = ProductSeeder_1 = class ProductSeeder {
    repository;
    logger = new Logger(ProductSeeder_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async seed() {
        const productName = 'Pan Baguette Masa Madre';
        const exists = await this.repository.findByName(productName);
        if (!exists) {
            await this.repository.create(new Product({
                name: productName,
                description: 'Baguette crocante tradicional 300g',
                price: 8500,
                stock: 30,
                productTypeId: 1,
                status: 'active',
            }));
            this.logger.log(`Seeder products: producto "${productName}" creado`);
        }
    }
};
ProductSeeder = ProductSeeder_1 = __decorate([
    Injectable(),
    __param(0, Inject(PRODUCT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ProductSeeder);
export { ProductSeeder };
//# sourceMappingURL=product.seeder.js.map