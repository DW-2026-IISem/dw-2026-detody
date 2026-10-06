"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const index_js_1 = require("./config/environment/index.js");
const sequelize_module_js_1 = require("./infrastructure/database/sequelize/sequelize.module.js");
const health_controller_js_1 = require("./health/health.controller.js");
const clients_module_js_1 = require("./features/business/clients/clients.module.js");
const product_types_module_js_1 = require("./features/business/product-types/product-types.module.js");
const products_module_js_1 = require("./features/business/products/products.module.js");
const sales_module_js_1 = require("./features/business/sales/sales.module.js");
const main_seeder_js_1 = require("./infrastructure/database/sequelize/seeders/main.seeder.js");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            index_js_1.EnvironmentModule,
            sequelize_module_js_1.SequelizeModule,
            clients_module_js_1.ClientsModule,
            product_types_module_js_1.ProductTypesModule,
            products_module_js_1.ProductsModule,
            sales_module_js_1.SalesModule,
        ],
        controllers: [health_controller_js_1.HealthController],
        providers: [main_seeder_js_1.MainSeeder],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map