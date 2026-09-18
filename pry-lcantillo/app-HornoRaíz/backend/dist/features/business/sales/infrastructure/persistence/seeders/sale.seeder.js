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
var SaleSeeder_1;
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Sale } from '../../../domain/entities/sale.entity.js';
import { SALE_REPOSITORY } from '../../../domain/interfaces/sale.repository.js';
let SaleSeeder = SaleSeeder_1 = class SaleSeeder {
    repository;
    logger = new Logger(SaleSeeder_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async seed() {
        const existing = await this.repository.findById(1);
        if (!existing) {
            await this.repository.create(new Sale({
                clientId: 1,
                items: [{ productId: 1, quantity: 2, unitPrice: 8500, subtotal: 17000 }],
                status: 'completed',
            }));
            this.logger.log('Seeder sales: venta inicial creada con éxito');
        }
    }
};
SaleSeeder = SaleSeeder_1 = __decorate([
    Injectable(),
    __param(0, Inject(SALE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], SaleSeeder);
export { SaleSeeder };
//# sourceMappingURL=sale.seeder.js.map