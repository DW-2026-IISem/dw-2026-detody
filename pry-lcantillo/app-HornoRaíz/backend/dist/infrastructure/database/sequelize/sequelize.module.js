var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Global, Module } from '@nestjs/common';
import { ENV_CONFIG } from '../../../config/environment/index.js';
import { sequelizeFactory } from './sequelize.factory.js';
export const SEQUELIZE = 'SEQUELIZE';
let SequelizeModule = class SequelizeModule {
};
SequelizeModule = __decorate([
    Global(),
    Module({
        providers: [
            {
                provide: SEQUELIZE,
                inject: [ENV_CONFIG],
                useFactory: async (cfg) => {
                    const sequelize = sequelizeFactory(cfg);
                    await sequelize.authenticate();
                    await sequelize.sync({ alter: false });
                    return sequelize;
                },
            },
        ],
        exports: [SEQUELIZE],
    })
], SequelizeModule);
export { SequelizeModule };
//# sourceMappingURL=sequelize.module.js.map