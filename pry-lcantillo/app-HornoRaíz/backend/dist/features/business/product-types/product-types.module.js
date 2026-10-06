"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypesModule = void 0;
const common_1 = require("@nestjs/common");
const create_product_type_use_case_js_1 = require("./application/use-cases/create-product-type.use-case.js");
const get_product_type_by_id_use_case_js_1 = require("./application/use-cases/get-product-type-by-id.use-case.js");
const list_product_types_use_case_js_1 = require("./application/use-cases/list-product-types.use-case.js");
const product_type_repository_js_1 = require("./domain/interfaces/product-type.repository.js");
const product_type_repository_js_2 = require("./infrastructure/persistence/repositories/product-type.repository.js");
const product_type_seeder_js_1 = require("./infrastructure/persistence/seeders/product-type.seeder.js");
const product_types_controller_js_1 = require("./presentation/http/controllers/product-types.controller.js");
let ProductTypesModule = class ProductTypesModule {
};
exports.ProductTypesModule = ProductTypesModule;
exports.ProductTypesModule = ProductTypesModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_types_controller_js_1.ProductTypesController],
        providers: [
            create_product_type_use_case_js_1.CreateProductTypeUseCase,
            list_product_types_use_case_js_1.ListProductTypesUseCase,
            get_product_type_by_id_use_case_js_1.GetProductTypeByIdUseCase,
            product_type_seeder_js_1.ProductTypeSeeder,
            { provide: product_type_repository_js_1.PRODUCT_TYPE_REPOSITORY, useClass: product_type_repository_js_2.ProductTypeRepository },
        ],
        exports: [product_type_repository_js_1.PRODUCT_TYPE_REPOSITORY, product_type_seeder_js_1.ProductTypeSeeder],
    })
], ProductTypesModule);
//# sourceMappingURL=product-types.module.js.map