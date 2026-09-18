var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MainSeeder_1;
import { Injectable, Logger } from '@nestjs/common';
import { ClientSeeder } from '../../../../features/business/clients/infrastructure/persistence/seeders/client.seeder.js';
import { ProductTypeSeeder } from '../../../../features/business/product-types/infrastructure/persistence/seeders/product-type.seeder.js';
import { ProductSeeder } from '../../../../features/business/products/infrastructure/persistence/seeders/product.seeder.js';
import { SaleSeeder } from '../../../../features/business/sales/infrastructure/persistence/seeders/sale.seeder.js';
let MainSeeder = MainSeeder_1 = class MainSeeder {
    clientSeeder;
    productTypeSeeder;
    productSeeder;
    saleSeeder;
    logger = new Logger(MainSeeder_1.name);
    constructor(clientSeeder, productTypeSeeder, productSeeder, saleSeeder) {
        this.clientSeeder = clientSeeder;
        this.productTypeSeeder = productTypeSeeder;
        this.productSeeder = productSeeder;
        this.saleSeeder = saleSeeder;
    }
    async run() {
        this.logger.log('Iniciando proceso de seeding global...');
        await this.clientSeeder.seed();
        await this.productTypeSeeder.seed();
        await this.productSeeder.seed();
        await this.saleSeeder.seed();
        this.logger.log('Seeding global finalizado exitosamente.');
    }
};
MainSeeder = MainSeeder_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ClientSeeder,
        ProductTypeSeeder,
        ProductSeeder,
        SaleSeeder])
], MainSeeder);
export { MainSeeder };
//# sourceMappingURL=main.seeder.js.map