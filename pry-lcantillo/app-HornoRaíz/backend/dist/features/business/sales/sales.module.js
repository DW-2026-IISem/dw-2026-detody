var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module.js';
import { ProductsModule } from '../products/products.module.js';
import { CreateSaleUseCase } from './application/use-cases/create-sale.use-case.js';
import { GetSaleByIdUseCase } from './application/use-cases/get-sale-by-id.use-case.js';
import { ListSalesUseCase } from './application/use-cases/list-sales.use-case.js';
import { SALE_REPOSITORY } from './domain/interfaces/sale.repository.js';
import { SaleRepository } from './infrastructure/persistence/repositories/sale.repository.js';
import { SaleSeeder } from './infrastructure/persistence/seeders/sale.seeder.js';
import { SalesController } from './presentation/http/controllers/sales.controller.js';
let SalesModule = class SalesModule {
};
SalesModule = __decorate([
    Module({
        imports: [ClientsModule, ProductsModule],
        controllers: [SalesController],
        providers: [
            CreateSaleUseCase,
            ListSalesUseCase,
            GetSaleByIdUseCase,
            SaleSeeder,
            { provide: SALE_REPOSITORY, useClass: SaleRepository },
        ],
        exports: [SALE_REPOSITORY, SaleSeeder],
    })
], SalesModule);
export { SalesModule };
//# sourceMappingURL=sales.module.js.map