var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { EnvironmentModule } from './config/environment/index.js';
import { SequelizeModule } from './infrastructure/database/sequelize/sequelize.module.js';
import { HealthController } from './health/health.controller.js';
import { ClientsModule } from './features/business/clients/clients.module.js';
import { ProductTypesModule } from './features/business/product-types/product-types.module.js';
import { ProductsModule } from './features/business/products/products.module.js';
import { SalesModule } from './features/business/sales/sales.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [EnvironmentModule, SequelizeModule, ClientsModule, ProductTypesModule, ProductsModule, SalesModule],
        controllers: [HealthController],
        providers: [],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map