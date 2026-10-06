"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const product_types_module_js_1 = require("../product-types/product-types.module.js");
const create_product_use_case_js_1 = require("./application/use-cases/create-product.use-case.js");
const get_product_by_id_use_case_js_1 = require("./application/use-cases/get-product-by-id.use-case.js");
const list_products_use_case_js_1 = require("./application/use-cases/list-products.use-case.js");
const product_repository_js_1 = require("./domain/interfaces/product.repository.js");
const product_repository_js_2 = require("./infrastructure/persistence/repositories/product.repository.js");
const product_seeder_js_1 = require("./infrastructure/persistence/seeders/product.seeder.js");
const products_controller_js_1 = require("./presentation/http/controllers/products.controller.js");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [product_types_module_js_1.ProductTypesModule],
        controllers: [products_controller_js_1.ProductsController],
        providers: [
            create_product_use_case_js_1.CreateProductUseCase,
            list_products_use_case_js_1.ListProductsUseCase,
            get_product_by_id_use_case_js_1.GetProductByIdUseCase,
            product_seeder_js_1.ProductSeeder,
            { provide: product_repository_js_1.PRODUCT_REPOSITORY, useClass: product_repository_js_2.ProductRepository },
        ],
        exports: [product_repository_js_1.PRODUCT_REPOSITORY, product_seeder_js_1.ProductSeeder],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map