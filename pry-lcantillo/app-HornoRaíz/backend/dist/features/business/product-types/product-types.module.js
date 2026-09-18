var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { CreateProductTypeUseCase } from './application/use-cases/create-product-type.use-case.js';
import { GetProductTypeByIdUseCase } from './application/use-cases/get-product-type-by-id.use-case.js';
import { ListProductTypesUseCase } from './application/use-cases/list-product-types.use-case.js';
import { PRODUCT_TYPE_REPOSITORY } from './domain/interfaces/product-type.repository.js';
import { ProductTypeRepository } from './infrastructure/persistence/repositories/product-type.repository.js';
import { ProductTypeSeeder } from './infrastructure/persistence/seeders/product-type.seeder.js';
import { ProductTypesController } from './presentation/http/controllers/product-types.controller.js';
let ProductTypesModule = class ProductTypesModule {
};
ProductTypesModule = __decorate([
    Module({
        controllers: [ProductTypesController],
        providers: [
            CreateProductTypeUseCase,
            ListProductTypesUseCase,
            GetProductTypeByIdUseCase,
            ProductTypeSeeder,
            { provide: PRODUCT_TYPE_REPOSITORY, useClass: ProductTypeRepository },
        ],
        exports: [PRODUCT_TYPE_REPOSITORY, ProductTypeSeeder],
    })
], ProductTypesModule);
export { ProductTypesModule };
//# sourceMappingURL=product-types.module.js.map