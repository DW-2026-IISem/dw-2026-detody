var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ProductTypesModule } from '../product-types/product-types.module.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case.js';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case.js';
import { PRODUCT_REPOSITORY } from './domain/interfaces/product.repository.js';
import { ProductRepository } from './infrastructure/persistence/repositories/product.repository.js';
import { ProductSeeder } from './infrastructure/persistence/seeders/product.seeder.js';
import { ProductsController } from './presentation/http/controllers/products.controller.js';
let ProductsModule = class ProductsModule {
};
ProductsModule = __decorate([
    Module({
        imports: [ProductTypesModule],
        controllers: [ProductsController],
        providers: [
            CreateProductUseCase,
            ListProductsUseCase,
            GetProductByIdUseCase,
            ProductSeeder,
            { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
        ],
        exports: [PRODUCT_REPOSITORY, ProductSeeder],
    })
], ProductsModule);
export { ProductsModule };
//# sourceMappingURL=products.module.js.map