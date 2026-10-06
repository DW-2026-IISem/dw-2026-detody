"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModule = void 0;
const common_1 = require("@nestjs/common");
const clients_module_js_1 = require("../clients/clients.module.js");
const products_module_js_1 = require("../products/products.module.js");
const create_sale_use_case_js_1 = require("./application/use-cases/create-sale.use-case.js");
const get_sale_by_id_use_case_js_1 = require("./application/use-cases/get-sale-by-id.use-case.js");
const list_sales_use_case_js_1 = require("./application/use-cases/list-sales.use-case.js");
const sale_repository_js_1 = require("./domain/interfaces/sale.repository.js");
const sale_repository_js_2 = require("./infrastructure/persistence/repositories/sale.repository.js");
const sale_seeder_js_1 = require("./infrastructure/persistence/seeders/sale.seeder.js");
const sales_controller_js_1 = require("./presentation/http/controllers/sales.controller.js");
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [clients_module_js_1.ClientsModule, products_module_js_1.ProductsModule],
        controllers: [sales_controller_js_1.SalesController],
        providers: [
            create_sale_use_case_js_1.CreateSaleUseCase,
            list_sales_use_case_js_1.ListSalesUseCase,
            get_sale_by_id_use_case_js_1.GetSaleByIdUseCase,
            sale_seeder_js_1.SaleSeeder,
            { provide: sale_repository_js_1.SALE_REPOSITORY, useClass: sale_repository_js_2.SaleRepository },
        ],
        exports: [sale_repository_js_1.SALE_REPOSITORY, sale_seeder_js_1.SaleSeeder],
    })
], SalesModule);
//# sourceMappingURL=sales.module.js.map